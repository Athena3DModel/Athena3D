/**
 * Configuration file for Truffle
 * See https://trufflesuite.com/docs/truffle/reference/configuration
 */

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Load environment variables or use defaults
const MNEMONIC = process.env.MNEMONIC || '';
const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

module.exports = {
  networks: {
    // Development network - ganache
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975,
    },
    
    // Goerli testnet
    goerli: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://goerli.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    
    // Sepolia testnet
    sepolia: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    
    // Ethereum mainnet
    mainnet: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 1,
      gas: 5500000,
      gasPrice: 50000000000, // 50 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false
    },
  },
  
  // Configure compiler settings
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  
  // Plugin for verifying contracts on Etherscan
  plugins: [
    'truffle-plugin-verify'
  ],
  
  // API keys for verification
  api_keys: {
    etherscan: ETHERSCAN_API_KEY
  }
}; 