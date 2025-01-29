import { defineChain } from 'thirdweb';

/**
 * @chain
 */
export const sonicBlaze = /*@__PURE__*/ defineChain({
  id: 57054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: { name: 'Sonic Testnet', symbol: 'S', decimals: 18 },
  blockExplorers: [
    {
      name: 'sonicTestnet',
      url: 'https://testnet.sonicscan.org/',
      apiUrl: 'https://api-testnet.sonicscan.org/api',
    },
  ],
  testnet: true,
});

export const sonicBlazeRPC: string = 'https://rpc.blaze.soniclabs.com';
