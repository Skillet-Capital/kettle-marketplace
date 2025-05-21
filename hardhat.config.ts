import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-tracer";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// This key will be used if PRIVATE_KEY is not set in the .env file
const defaultPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  mocha: {
    // default is 40000ms; bump it up to 2 minutes (120000ms) or whatever you need
    timeout: 600000
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 100,
            details: {
              yulDetails: {
                optimizerSteps: "u",
              },
            },
          },
        },
      },
    ]
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337,
    },
    // Base Sepolia testnet
    berachain: {
      url: process.env.RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || defaultPrivateKey],
      chainId: 80094,
      gasPrice: 1000000000, // 1 gwei
    },
  },
  etherscan: {
    apiKey: {
      berachain: "NKUQFBVG8H3UGB2GHNM51ZWWU47D46Y4JJ",
    },
    customChains: [
      {
        network: "berachain",
        chainId: 80094,
        urls: {
          apiURL: "https://api.berascan.com/api",
          browserURL: "https://berascan.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
