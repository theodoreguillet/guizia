'use client';

// pages/collection
import React, { useEffect, useState } from 'react';
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

  const fetchCollection = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
      );
      const tokenIds = await contract.tokenIdsOf(account?.address);
      console.log('fetch Contract done ', tokenIds);
      setTokenIds(tokenIds);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [account]);

  return (
    <div className={styles.collectionContainer}>
      <p className="font-bold text-5xl mb-10">Collection</p>
      <p className="text-neutral-50 mb-3">
        {`Below are all your owned Guizia NFTs.`}
      </p>
      {tokenIds && tokenIds.length ? (
        <div className="grid grid-flow-col grid-rows-4 gap-4">
          {tokenIds.map((tokenId, i) => {
            return (
              <NFTProvider contract={contractNFT} tokenId={tokenId}>
                <NFTMedia />
                <NFTName />
              </NFTProvider>
            );
          })}
        </div>
      ) : (
        <p>You don't own any Guizia.</p>
      )}
    </div>
  );
}
