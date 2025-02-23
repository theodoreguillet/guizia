'use client';

// pages/collection
import React, { useEffect, useState, useCallback } from 'react';
import styles from './Collection.module.css';
import {
  NFTMedia,
  NFTName,
  NFTProvider,
  useActiveAccount,
} from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { sonicBlaze, sonicBlazeRPC } from '@/chains/sonic-blaze';
import { client } from '../client';
import { useLoading } from '../components/LoadingContext/LoadingContext';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as string;
const contractABI = require('../../abi/guizia-nft.abi.json');

const provider = new ethers.JsonRpcProvider(sonicBlazeRPC);

const contractNFT = getContract({
  address: contractAddress,
  chain: sonicBlaze,
  client,
});

export default function Collection() {
  const { loading, setLoading } = useLoading();
  const [tokenIds, setTokenIds] = useState([]);
  const account = useActiveAccount();
  const router = useRouter();

  const fetchCollection = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
      );
      const tokenIds = await contract.tokenIdsOf(account?.address);
      setTokenIds(tokenIds);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (!account) {
      router.push('/');
      return;
    }
    fetchCollection();
  }, [account, fetchCollection, router]);

  return (
    <div className={styles.collectionContainer}>
      <p className="font-bold text-5xl mb-10">Collection</p>
      <p className="text-neutral-50 mb-10">
        {`Below are all your owned Guizia NFTs.`}
      </p>
      {tokenIds && tokenIds.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tokenIds.map((tokenId, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 border rounded-lg shadow-lg bg-gray-900"
            >
              <NFTProvider contract={contractNFT} tokenId={tokenId}>
                <NFTMedia className="w-full h-48 object-cover rounded-md" />
                <NFTName className="mt-2 text-center text-white font-semibold" />
              </NFTProvider>
            </div>
          ))}
        </div>
      ) : (
        <p>You don&apos;t own any Guizia.</p>
      )}
    </div>
  );
}
