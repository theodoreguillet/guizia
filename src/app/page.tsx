'use client';

import { ConnectButton, useActiveWallet } from 'thirdweb/react';
import { client } from './client';
import { createWallet } from 'thirdweb/wallets';
import { sonicBlaze } from '@/chains/sonic-blaze';
import { useEffect, useState } from 'react';

export default function Home() {
  const [logged, setLogged] = useState(false);
  const wallet = useActiveWallet();

  useEffect(() => {
    wallet ? setLogged(true) : setLogged(false);
  }, [wallet]); // Re-run the effect whenever the wallet address changes

  return (
    <div className="py-20">
      <header className="flex flex-col items-center mb-12 md:mb-12">
        <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
          <span className="inline-block -skew-x-6 text-blue-500"> DefAI </span>
          <span> NFT Agent</span>
        </h1>

        <p className="text-zinc-300 text-base">
          {logged ? (
            ''
          ) : (
            <span>
              Connect your <b>wallet</b> to get started.{' '}
            </span>
          )}
        </p>
      </header>
      <div className="flex justify-center mb-5">
        <ConnectButton
          client={client}
          appMetadata={{
            name: 'Guizia',
            url: 'https://guizia.io',
          }}
          wallets={[createWallet('io.rabby'), createWallet('io.metamask')]}
          chain={sonicBlaze}
        />
      </div>
    </div>
  );
}
