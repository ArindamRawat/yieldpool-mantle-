
// Mantle Testnet - Contract Addresses
export const COMMUNITY_YIELD_POOL_ADDRESS = 
  import.meta.env.VITE_COMMUNITY_YIELD_POOL_ADDRESS || "0x99E1e7aFddd4380Ea510B0e16C27B0df93C809db";
export const MOCK_STABLE_ADDRESS = 
  import.meta.env.VITE_MOCK_STABLE_ADDRESS || "0xd6ab42c85DA47FD1ccCc5A8A4c109157bc16b5a2";
export const REWARD_TOKEN_ADDRESS = 
  import.meta.env.VITE_REWARD_TOKEN_ADDRESS || "0x3E90F36A70eE6A2C4D4133d4ED5B62E06Ae2a5b5";

// Network Configuration
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "5003";
export const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.sepolia.mantle.xyz";

// Contract Parameters (Mantle Testnet)
export const REWARD_RATE = import.meta.env.VITE_REWARD_RATE || "100000000000000000";
export const PENALTY_BPS = import.meta.env.VITE_PENALTY_BPS || "500";
export const MAX_LOCK = import.meta.env.VITE_MAX_LOCK || "2592000";
export const BOOST_MAX_E18 = import.meta.env.VITE_BOOST_MAX_E18 || "2000000000000000000";

// Network Info for MetaMask
export const MANTLE_TESTNET_CONFIG = {
  chainId: "5003",
  chainName: "Mantle Sepolia Testnet",
  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
  blockExplorerUrls: ["https://explorer.sepolia.mantle.xyz"],
  nativeCurrency: {
    symbol: "MNT",
    decimals: 18
  }
};

