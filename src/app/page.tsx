'use client';

import { useActiveWallet } from 'thirdweb/react';
import { useEffect, useState } from 'react';
import { ThirdwebConnectButton } from './components/ConnectButton/ConnectButton';
import { Credits } from './components/Credits/Credits';

export default function Home() {
  const [logged, setLogged] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const wallet = useActiveWallet();

  // Ensure this runs only on the client to prevent SSR mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setLogged(!!wallet);
    }
  }, [wallet, isClient]);

  return (
    <div className="py-20">
      <header className="flex flex-col items-center mb-12 md:mb-12">
        <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
          <span className="inline-block -skew-x-6 text-blue-500"> DefAI </span>
          <span> NFT Agent</span>
        </h1>
      </header>
      <div className="flex justify-center mb-5">
        <div className="text-zinc-300 text-base">
          {isClient ? (
            logged ? (
              <Credits />
            ) : (
              <div className="flex flex-col">
                <p className="text-zinc-300 text-base">
                  Connect your <b>wallet</b> to get started.
                </p>
                <ThirdwebConnectButton />
              </div>
            )
          ) : (
            // Placeholder to prevent hydration mismatch
            <div className="text-zinc-300 text-base h-6 w-48 bg-zinc-800 rounded-md animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
