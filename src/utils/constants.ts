/**
 * API URLs and constants
 */

// BSC Scan API
export const BSC_SCAN_API_URL = "https://api.bscscan.com/api";
export const BSC_SCAN_API_KEY = "YourApiKey";

// CoinGecko API
export const COIN_GECKO_API_URL = "https://api.coingecko.com/api/v3";

// BNB Token Info
export const BNB_TOKEN_INFO = {
  symbol: "BNB",
  name: "Binance Coin",
  decimals: 18,
  iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
};

// Common BEP-20 tokens for demonstration
export const COMMON_TOKENS = [
  {
    symbol: "BUSD",
    name: "Binance USD",
    decimals: 18,
    contractAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    iconUrl: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
    coinGeckoId: "binance-usd"
  },
  {
    symbol: "CAKE",
    name: "PancakeSwap",
    decimals: 18,
    contractAddress: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    iconUrl: "https://cryptologos.cc/logos/pancakeswap-cake-logo.png",
    coinGeckoId: "pancakeswap-token"
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 18,
    contractAddress: "0x55d398326f99059ff775485246999027b3197955",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    coinGeckoId: "tether"
  },
  {
    symbol: "ETH",
    name: "Ethereum Token",
    decimals: 18,
    contractAddress: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    coinGeckoId: "ethereum"
  }
];
