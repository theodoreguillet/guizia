'use client';

import { sonicBlaze, sonicBlazeRPC } from '@/chains/sonic-blaze';
import styles from './Credits.module.css';
import { ethers, parseUnits } from 'ethers';
import { useEffect, useState } from 'react';

import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { prepareContractCall, sendTransaction } from 'thirdweb/transaction';
import { client } from '@/app/client';
import { getContract } from 'thirdweb/contract';

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as string;
const tokenABI = require('../../../abi/guizia.abi.json');
const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as string;
const contractABI = require('../../../abi/guizia-nft.abi.json');

const provider = new ethers.JsonRpcProvider(sonicBlazeRPC);

export function Credits() {
  const [credits, setCredits] = useState(0);
  const account = useActiveAccount();

  // Fetch NFT contract to get users credits
  const fetchContract = async () => {
    if (!account) return;

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      provider
    );

    let userCredits = await contract.getCredits(account?.address);

    console.debug('fetch Contract done ', userCredits);

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
      address: contractAddress, // Address of the main contract
      chain: sonicBlaze,
      client,
    });

    const tokenContract = new ethers.Contract(
      tokenAddress,
      tokenABI.abi,
      provider
    );

    console.debug('Token Contract:', tokenContract);
    console.debug('NFT Contract:', contract);

    const creditCost = parseUnits('100', 18); // Assuming the token uses 18 decimals

    console.debug('creditCost ', creditCost);

    // Step 1: Check Allowance of the NFT contract for the account

    let allowance = await tokenContract.allowance(
      account?.address,
      contractAddress
    );

    console.debug('Allowance:', allowance.toString());

    if (BigInt(allowance) < BigInt(creditCost)) {
      console.debug('Insufficient allowance. Approving...');

      // Step 2: Request Approval to give allowance to NFT contract
      const approveTx = prepareContractCall({
        contract: getContract({
          address: tokenAddress, // Address of the main contract
          chain: sonicBlaze,
          client,
        }),
        method: 'function approve(address spender, uint256 amount)',
        params: [contractAddress, creditCost],
      });

      const { transactionHash: approveHash } = await sendTransaction({
        transaction: approveTx,
        account,
      });

      console.debug('Approve Transaction Hash:', approveHash);

      // Wait for approval to be mined (optional but recommended)
      await waitForTransaction(approveHash);
    }

    // Step 3: Call buyCredit()
    const transaction = prepareContractCall({
      contract,
      method: 'function buyCredit()',
      params: [],
    });

    console.debug('Executing buyCredit transaction:', transaction);

    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });

    console.debug('buyCredit Transaction Hash:', transactionHash);

    if (transactionHash) {
      console.debug('fetch Contract');
      // Wait for buy transaction to be mined (optional but recommended)
      await waitForTransaction(transactionHash);
      fetchContract(); // Refresh contract state
    }
  };

  // Helper function to wait for a transaction to be mined
  const waitForTransaction = async (txHash: string) => {
    console.debug(`Waiting for transaction ${txHash} to be confirmed...`);
    return new Promise((resolve) => setTimeout(resolve, 2000));
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
