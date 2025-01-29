'use client';

import { client } from '@/app/client';
import { sonicBlaze } from '@/chains/sonic-blaze';
import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';

export function ThirdwebConnectButton() {
  return (
    <ConnectButton
      client={client}
      appMetadata={{
        name: 'Guizia',
        url: 'https://guizia.io',
      }}
      wallets={[createWallet('io.rabby'), createWallet('io.metamask')]}
      chain={sonicBlaze}
    />
  );
}
