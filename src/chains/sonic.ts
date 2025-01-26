import { defineChain } from 'thirdweb';

/**
 * @chain
 */
export const sonic = /*@__PURE__*/ defineChain({
  id: 146,
  name: 'Sonic',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  blockExplorers: [
    {
      name: 'sonic',
      url: 'https://sonicscan.org',
      apiUrl: 'https://api.sonicscan.org/api',
    },
  ],
});
