'use client';

import { sonicBlaze, sonicBlazeRPC } from '@/chains/sonic-blaze';
import styles from './Credits.module.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { prepareContractCall, sendTransaction } from 'thirdweb/transaction';
import { client } from '@/app/client';
import { getContract } from 'thirdweb/contract';

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as string;
const contractABI = require('../../../abi/guizia-nft.abi.json');

export function Credits() {
  const [credits, setCredits] = useState(0);
  const account = useActiveAccount();

  // Fetch NFT contract to get users credits
  const fetchContract = async () => {
    if (!account) return;

    const provider = new ethers.JsonRpcProvider(sonicBlazeRPC);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      provider
    );

    let userCredits = await contract.getCredits(account?.address);

    setCredits(Number(userCredits));
  };

  // Automatically fetch credits on mount & when account changes
  useEffect(() => {
    fetchContract();
  }, [account]);

  // Buy credits by sending a transaction to the NFT contract
  const buyCredits = async () => {
    if (!account) return;

    const contract = getContract({
      address: contractAddress,
      chain: sonicBlaze,
      client,
    });

    const transaction = prepareContractCall({
      contract,
      method: 'function buyCredit()',
      params: [],
    });

    if (account) {
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      if (transactionHash) {
        fetchContract();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p>
        You currently have{' '}
        <span className="underline underline-offset-2">{credits}</span> credits.
      </p>
      <button className={styles.creditsButton} onClick={buyCredits}>
        Buy credits
      </button>
    </div>
  );
}
