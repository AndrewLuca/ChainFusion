import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button";
import { Token } from "./components/Token";
import { Wallet, LogOut, Copy, ExternalLink, Plus, RefreshCw, ArrowRight, Send } from "lucide-react";
import {
  formatAddress, 
  clearWallet, 
  fetchTokenBalances,
  fetchMockedTokenBalances,
  calculatePortfolioValue,
  TokenInfo 
} from "./utils/walletUtils";

declare const ethers: any;

export default function Dashboard() {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState<{
    address: string;
    privateKey: string;
  } | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [portfolioValue, setPortfolioValue] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mock, setMock] = useState(false);

  // Check if wallet exists and load it
  useEffect(() => {
    const wallet = localStorage.getItem("chainFusionWallet");
    if (!wallet) {
      navigate("/Login");
      return;
    }
    
    setWalletInfo(JSON.parse(wallet));
  }, [navigate]);

  // Fetch token balances when wallet info is available
  useEffect(() => {
    if (!walletInfo) return;

    const loadTokenData = async () => {
      setIsLoading(true);
      try {
        // Fetch token balances
        const tokenBalances = await fetchTokenBalances(walletInfo.address);
        
        // Calculate portfolio value
        const totalValue = calculatePortfolioValue(tokenBalances);
        
        setTokens(tokenBalances);
        setPortfolioValue(totalValue);
      } catch (error) {
        console.error("Error loading token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenData();
    
    // Set up a refresh interval
    const intervalId = setInterval(loadTokenData, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, [walletInfo]);
  
  // Function to manually refresh balances
  const refreshBalances = async () => {
    if (!walletInfo) return;
    
    setIsLoading(true);
    try {
      var tokenBalances;

      if (mock) {
        tokenBalances = await fetchMockedTokenBalances();
      } else {
        tokenBalances = await fetchTokenBalances(walletInfo.address);
      }

      //const tokensWithPrices = await fetchTokenPrices(tokenBalances);
      const totalValue = calculatePortfolioValue(tokenBalances);
      
      setTokens(tokenBalances);
      setPortfolioValue(totalValue);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (!walletInfo) return;
    
    navigator.clipboard.writeText(walletInfo.address)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Failed to copy address:", err));
  };

  const refreshMockedBalances = async () => {
    setMock(true);
    await refreshBalances();
  }

  // Log out (clear wallet)
  const handleLogout = () => {
    clearWallet();
    navigate("/");
  };

  if (!walletInfo) return null; // Will redirect to wallet page via useEffect

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center mr-2">
            <Wallet className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">ChainFusion</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-300 hover:text-white flex items-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Wallet Summary Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-400">Wallet Address</h2>
              <div className="flex items-center mt-1">
                <p className="font-mono text-sm mr-2">{formatAddress(walletInfo.address)}</p>
                <button 
                  onClick={copyAddress}
                  className="p-1.5 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <span className="text-green-400 text-xs font-medium">Copied!</span>
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <a 
              href={`https://etherscan.io/address/${walletInfo.address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 text-xs flex items-center hover:underline"
            >
              View on Etherscan
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Portfolio Value</h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold">${parseFloat(portfolioValue).toLocaleString()}</p>
              <p className="text-lg ml-2 text-gray-400">USD</p>
              <button 
                onClick={refreshBalances} 
                className="ml-3 p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                disabled={isLoading}
                title="Refresh balances" 
              >
                <RefreshCw 
                  className={`h-4 w-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {tokens.length} tokens
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Button
            className="py-6 flex justify-between items-center"
            onClick={() => window.open("https://app.uniswap.org/")}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-900/40 mr-3">
                <Send className="h-5 w-5 text-blue-400" />
              </div>
              <span>Send Tokens</span>
            </div>
            <ArrowRight className="h-5 w-5 opacity-50" />
          </Button>
          
          <Button 
            variant="outline" 
            className="py-6 flex justify-between items-center"
            onClick={() => window.open("https://www.moonpay.com/buy/eth")}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-900/40 mr-3">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
              <span>Buy Tokens</span>
            </div>
            <ArrowRight className="h-5 w-5 opacity-50" />
          </Button>
        </div>
        
        {/* Token Balances Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Token Balances</h2>
            <Button
              variant="outline" size="sm"
              onClick={() => refreshMockedBalances()}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Mock Tokens</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            {isLoading && tokens.length === 0 ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <div key={i} className="border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse mr-3"></div>
                    <div>
                      <div className="w-24 h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                      <div className="w-16 h-3 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))
            ) : tokens.length > 0 ? (
              // Token list
              tokens.map((token, index) => (
                <Token
                  key={token.symbol + index}
                  symbol={token.symbol}
                  name={token.name}
                  balance={parseFloat(token.balance)}
                  usdValue={token.usdValue?.toString() || "0.00"}
                  usdPriceChange={token.usdPriceChange?.toString() || "0.00"}
                  iconUrl={token.iconUrl}
                  contractAddress={token.contractAddress}
                  isLoading={isLoading}
                />
              ))
            ) : (
              // No tokens found
              <div className="border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500">No tokens found in this wallet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
