'use client';

import { sonicBlaze, sonicBlazeRPC } from '@/chains/sonic-blaze';
import styles from './Credits.module.css';
import { ethers, parseUnits } from 'ethers';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  NFTMedia,
  NFTName,
  NFTProvider,
  useActiveAccount,
} from 'thirdweb/react';
import { prepareContractCall, sendTransaction } from 'thirdweb/transaction';
import { client } from '@/app/client';
import { getContract } from 'thirdweb/contract';
import { useLoading } from '../LoadingContext/LoadingContext';
import { generateGuiziaMetadata } from '@/utils/ipfs';

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as string;
const tokenABI = require('../../../abi/guizia.abi.json');
const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT as string;
const contractABI = require('../../../abi/guizia-nft.abi.json');

const contractNFT = getContract({
  address: contractAddress,
  chain: sonicBlaze,
  client,
});

const provider = new ethers.JsonRpcProvider(sonicBlazeRPC);

export function Credits() {
  const { loading, setLoading } = useLoading();
  const [credits, setCredits] = useState(0);
  const [displayNFT, setDisplayNFT] = useState(false);
  const [NFTId, setNFTId] = useState(0n);
  const [twitter, setTwitter] = useState('');

  const account = useActiveAccount();

  const updateCredits = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
      );
      let userCredits = await contract.getCredits(account?.address);
      console.debug('fetch Contract done ', userCredits);
      setCredits(Number(userCredits));
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCredits();
  }, [account]);

  const buyCredits = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI.abi,
        provider
      );
      const creditCost = parseUnits('55555', 18);
      const amount = BigInt(1);

      let allowance = await tokenContract.allowance(
        account?.address,
        contractAddress
      );

      if (BigInt(allowance) < BigInt(creditCost) * BigInt(amount)) {
        console.log('Approving token spend...');
        const approveTx = prepareContractCall({
          contract: getContract({
            address: tokenAddress,
            chain: sonicBlaze,
            client,
          }),
          method: 'function approve(address spender, uint256 amount)',
          params: [contractAddress, creditCost * amount],
        });
        const { transactionHash: approveHash } = await sendTransaction({
          transaction: approveTx,
          account,
        });
        await waitForTransaction(approveHash);

        // Check allowance again after approval
        allowance = await tokenContract.allowance(
          account?.address,
          contractAddress
        );

        if (BigInt(allowance) < BigInt(creditCost) * BigInt(amount)) {
          throw new Error('Insufficient token allowance after approval');
        }
      }

      const transaction = prepareContractCall({
        contract: contractNFT,
        method: 'function buyCredit(uint256 amount)',
        params: [amount],
      });
      const { transactionHash } = await sendTransaction({
        transaction: transaction,
        account,
      });
      if (transactionHash) {
        await waitForTransaction(transactionHash);
        updateCredits();
      }
    } catch (error) {
      console.error('Error buying credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const ipfsMetadata = await generateGuiziaMetadata(twitter);

      const transaction = prepareContractCall({
        contract: contractNFT,
        method: 'function mint(address userAddress, string memory tokenURI)',
        params: [account.address, ipfsMetadata],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      if (transactionHash) {
        // Mint successful
        await waitForTransaction(transactionHash);

        // Update user credits
        updateCredits();

        // Fetch transaction receipt
        const receipt = await provider.getTransactionReceipt(transactionHash);

        if (receipt && receipt.logs.length > 0) {
          // Getting the minted NFT id from the mint Event
          const mintEvent = receipt.logs.find(
            (log) => log.address.toLowerCase() === contractAddress.toLowerCase()
          );

          if (mintEvent) {
            const newItemId = ethers.toBigInt(mintEvent.topics[3]);
            // Update the minted NFT Id
            setDisplayNFT(true);
            setNFTId(newItemId);
            return newItemId;
          }
        }
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTwitterUsername = (input: string) => {
    const regex = /(?:@|https:\/\/x\.com\/)?([a-zA-Z0-9_]+)/;
    const match = input.match(regex);
    const username = match ? match[1] : '';

    setTwitter(username);
  };

  const waitForTransaction = async (txHash: string) => {
    console.debug(`Waiting for transaction ${txHash} to be confirmed...`);
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {loading && <p>Loading...</p>}
      <div className="flex">
        <p>
          You currently have{' '}
          <span className="underline underline-offset-2">{credits}</span> credit
          {credits > 1 ? 's' : ''}.
        </p>
        <Image src="/coin.gif" width={20} height={20} alt="Coin" />
      </div>
      <button
        className={styles.creditsButton}
        onClick={buyCredits}
        disabled={loading}
      >
        Buy credits
      </button>
      {credits > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <div>
            <span>Twitter username:</span>
            <input
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="GuiziaAI"
              value={twitter}
              onChange={(e) => setTwitterUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              className={styles.creditsButton}
              onClick={mintNFT}
              disabled={loading}
            >
              Mint NFT (1-credit)
            </button>
            (mint usually takes 〜45sec)
          </div>
        </div>
      ) : null}
      {displayNFT ? (
        <>
          <p>Mint successful !</p>
          <NFTProvider contract={contractNFT} tokenId={NFTId}>
            <NFTMedia />
            <NFTName />
          </NFTProvider>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
