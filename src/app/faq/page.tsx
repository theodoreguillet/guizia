'use client';

// pages/faq
import React from 'react';
import styles from './FAQ.module.css';
import { FAQCard } from '../components/FAQCard/FAQCard';

export default function FAQ() {
  return (
    <div className={styles.faqContainer}>
      <p className="font-bold text-5xl mb-10">FAQ</p>
      <p className="text-neutral-50 mb-3">
        {`Don't find your question here ? Reach out to us on Discord or X.`}
      </p>
      <FAQCard
        title="What is Guizia ?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, dui imperdiet elementum cursus, dolor massa volutpat justo, vitae tempor sapien elit ut leo. Vestibulum porttitor sapien at odio blandit, sit amet laoreet enim ornare. Nulla vestibulum, tellus ut consectetur laoreet, mauris risus interdum tortor, vel aliquam ex purus at quam. Nam urna odio, mattis vel felis eget"
      />
      <FAQCard
        title="How to mint an NFT using Guizia ?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, dui imperdiet elementum cursus, dolor massa volutpat justo, vitae tempor sapien elit ut leo. Vestibulum porttitor sapien at odio blandit, sit amet laoreet enim ornare. Nulla vestibulum, tellus ut consectetur laoreet, mauris risus interdum tortor, vel aliquam ex purus at quam. Nam urna odio, mattis vel felis eget"
      />
      <FAQCard
        title="What wallet should I use?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, dui imperdiet elementum cursus, dolor massa volutpat justo, vitae tempor sapien elit ut leo. Vestibulum porttitor sapien at odio blandit, sit amet laoreet enim ornare. Nulla vestibulum, tellus ut consectetur laoreet, mauris risus interdum tortor, vel aliquam ex purus at quam. Nam urna odio, mattis vel felis eget"
      />
      <FAQCard
        title="Which tokens are supported ?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, dui imperdiet elementum cursus, dolor massa volutpat justo, vitae tempor sapien elit ut leo. Vestibulum porttitor sapien at odio blandit, sit amet laoreet enim ornare. Nulla vestibulum, tellus ut consectetur laoreet, mauris risus interdum tortor, vel aliquam ex purus at quam. Nam urna odio, mattis vel felis eget"
      />
      <FAQCard
        title="Where can I see my NFT ?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum, dui imperdiet elementum cursus, dolor massa volutpat justo, vitae tempor sapien elit ut leo. Vestibulum porttitor sapien at odio blandit, sit amet laoreet enim ornare. Nulla vestibulum, tellus ut consectetur laoreet, mauris risus interdum tortor, vel aliquam ex purus at quam. Nam urna odio, mattis vel felis eget"
      />
    </div>
  );
}
