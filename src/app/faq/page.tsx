'use client';

// pages/faq
import React from 'react';
import styles from './FAQ.module.css';
import { FAQCard } from '../components/FAQCard/FAQCard';

export default function FAQ() {
  const tokenContract = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as string;

  return (
    <div className={styles.faqContainer}>
      <p className="font-bold text-5xl mb-10">FAQ</p>
      <p className="text-neutral-50 mb-3">
        {`Don't find your question here ? Reach out to us on X @GuiziaAI.`}
      </p>
      <FAQCard
        title="What is Guizia ?"
        description="Guizia is a DefAI project built on Sonic blockchain. Guizia has an autonomous behaviour seen through his twitter account and a $Guizia token that fuels the mint of beautiful raccoons. All powered by AI."
      />
      <FAQCard
        title="How to mint an NFT using Guizia ?"
        description="To mint a Guizia NFT, you need to buy credits using $GUIZIA token. Each credit costs 55555 $GUIZIA. One credit gives access to one mint. The first transaction when buying credits is to give allowance of spending 55555 tokens to the Guizia NFT contract. If you already gave allowance, there is a single transaction to buy credits. The mint process usually takes around 45 seconds. After minting, you can see your Guizia NFTs on the Collection page."
      />
      <FAQCard
        title="What wallet should I use?"
        description="Any compatible EVM wallet should work. We recommend using Rabby wallet."
      />
      <FAQCard
        title="Which tokens are supported ?"
        description={
          'Guizia supports $GUIZIA. The contract for $GUIZIA is: ' +
          tokenContract
        }
      />
      <FAQCard
        title="Where can I see my NFT ?"
        description="Once minted, your Guizia NFT is visible directly after minting, and on the /collection page. You should soon be able to trade it on paintswap.io"
      />
    </div>
  );
}
