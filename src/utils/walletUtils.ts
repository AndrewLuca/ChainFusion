import Moralis from 'moralis';
import { isAddress } from "ethers";

/**
 * Utility functions for wallet management
 */

// Use simple relative import since both files are in the same directory
import { BNB_TOKEN_INFO, COMMON_TOKENS } from "./constants";

// Track Moralis initialization state
let moralisInitialized = false;

// Initialize Moralis only once
const initMoralis = async () => {
  if (!moralisInitialized) {
    try {
      await Moralis.start({
        apiKey: import.meta.env.VITE_MORALIS_API_KEY,
      });
      moralisInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Moralis:", error);
    }
  }
};

// Token interface for BEP-20 tokens
export interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: string;
  contractAddress: string;
  usdPrice: number | null;
  usdPriceChange: number | null;
  usdValue: number | null;
  iconUrl?: string;
}

interface WalletInfo {
  address: string;
  privateKey?: string;
  mnemonic?: string;
}

/**
 * Save wallet information to local storage
 * In a production app, this should be encrypted
 */
export const saveWallet = (walletInfo: WalletInfo): void => {
  try {
    // In a real application, we would encrypt the private key before storing
    // This is just a simplified example
    localStorage.setItem(
      "chainFusionWallet",
      JSON.stringify({
        address: walletInfo.address,
        privateKey: walletInfo.privateKey,
        // Only store mnemonic if provided
        ...walletInfo.mnemonic ? { mnemonic: walletInfo.mnemonic } : {}
      })
    );
  } catch (error) {
    console.error("Failed to save wallet:", error);
    throw new Error("Failed to save wallet information");
  }
};

/**
 * Retrieve wallet information from local storage
 */
export const getWallet = (): WalletInfo | null => {
  try {
    const data = localStorage.getItem("chainFusionWallet");
    if (!data) return null;

    return JSON.parse(data) as WalletInfo;
  } catch (error) {
    console.error("Failed to retrieve wallet:", error);
    return null;
  }
};

/**
 * Check if a wallet exists in local storage
 */
export const hasWallet = (): boolean => {
  return localStorage.getItem("chainFusionWallet") !== null;
};

/**
 * Clear wallet information from local storage
 */
export const clearWallet = (): void => {
  localStorage.removeItem("chainFusionWallet");
};

/**
 * Format an address for display (shortens it)
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const isValidMnemonic = (mnemonic: string): boolean => {
  try {
    // Only use our custom validation method
    // Check if it matches expected BIP39 format (12, 15, 18, 21, or 24 words)
    const wordCount = mnemonic?.trim().split(/\s+/).length || 0;
    const isValidWordCount = [12, 15, 18, 21, 24].includes(wordCount);
    
    // Check if words are in basic English (simplified check)
    const hasOnlyValidChars = /^[a-zA-Z\s]+$/.test(mnemonic);
    
    // Return our custom validation result
    return isValidWordCount && hasOnlyValidChars;
  } catch (error) {
    console.error("Error in mnemonic validation:", error);
    return false;
  }
};

export const isValidAddress = (key: string): boolean => {
  // Basic validation: starts with 0x and is 66 characters long (0x + 64 hex characters)
  return isAddress(key);
};

export const fetchTokenBalances = async (address: string): Promise<TokenInfo[]> => {
  // Update to use the correct environment variable format for Vite
  try {
    if (!moralisInitialized) {
      await initMoralis();
    }

    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      "chain": "0x1",
      "address": address,
    });
    
    const tokenBalances: TokenInfo[] = [];
    console.log("Token Balances Response:", response);

    response.result.forEach((tx: any) => {
      if (tx.usdValue == 0) return; // Skip zero balances
      tokenBalances.push({
        symbol: tx.symbol,
        name: tx.name,
        balance: tx.balanceFormatted, // Add missing property
        balanceRaw: tx.balance_raw || "", // Add missing property
        usdPrice: tx.usdPrice || null, // Add missing property
        usdPriceChange: tx.usdPrice24hrPercentChange || null, // Add missing property
        usdValue: tx.usdValue,
        iconUrl: tx.logo || undefined, // Fix optional property
        contractAddress: tx.tokenAddress?._value || tx.tokenAddress || undefined // Extract value from EvmAddress object
      });
    });

    return tokenBalances;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    return [];
  }
};

/**
 * Fetch token balances for a wallet address
 * In a production app, this would use a real API call to BSC Scan or similar
 */
export const fetchMockedTokenBalances = async (): Promise<TokenInfo[]> => {
  // For demo purposes, we'll use mock data
  // In a real app, you'd fetch from BSC Scan API
  const mockTokens: TokenInfo[] = [
    {
      symbol: "BNB",
      name: "Binance Coin",
      balance: "0.05",
      balanceRaw: "50000000000000000",
      contractAddress: "", // Native token
      usdPrice: null,
      usdPriceChange: null,
      usdValue: null,
      iconUrl: BNB_TOKEN_INFO.iconUrl
    },
    ...COMMON_TOKENS.map(token => ({              
      ...token,
      balance: Math.random().toFixed(4),
      balanceRaw: "", // Would be actual raw balance in production
      usdPrice: null,
      usdPriceChange: null,
      usdValue: null
    }))
  ];

  return mockTokens;
};

// generate a random balance for each token
export const generateRandomBalances = (tokens: TokenInfo[]): TokenInfo[] => { 
  return tokens.map(token => ({
    ...token,
    balance: Math.random().toFixed(4),
    balanceRaw: "", // Would be actual raw balance in production
    usdPrice: null,
    usdValue: null
  }));
};

/**
 * Calculate total portfolio value
 */
export const calculatePortfolioValue = (tokens: TokenInfo[]): string => {
  const total = tokens.reduce((sum, token) => {
    if (token.usdValue) {
      return sum + token.usdValue;
    }
    return sum;
  }, 0);

  return total.toFixed(2);
};