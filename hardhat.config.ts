import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-tracer";
import * as dotenv from "dotenv";
import { parseEther } from "ethers";

// Load environment variables from .env file
dotenv.config();

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
      accounts: [process.env.DEPLOYER_KEY!],
      chainId: 80094,
      gasPrice: 1000000000, // 1 gwei
    },
  },
  ignition: {
    strategyConfig: {
      create2: {
        salt: process.env.NODE_ENV === "PROD" 
        ? "0x4377ad62d745833ac7b1bb9e3d256ef9661a0fa126317ef3cce5fbc5b3318837"
        : "0x52126f02affe7aa9f4f425a2c74cf6db59643f8585b8fffe61c3be9878a141e7"
      },
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
