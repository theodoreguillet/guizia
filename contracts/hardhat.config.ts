import * as dotenv from 'dotenv';

require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');

dotenv.config();

const config: any = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sonicBlaze: {
      url: 'https://rpc.ankr.com/sonic_blaze_testnet',
      chainId: 57054,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sonicBlaze: process.env.SONICSCAN_TESTNET_API_KEY,
    },
    customChains: [
      {
        network: 'sonicBlaze',
        chainId: 57054,
        urls: {
          apiURL: 'https://api-testnet.sonicscan.org/api',
          browserURL: 'https://testnet.sonicscan.org',
        },
      },
    ],
  },
};

export default config;
