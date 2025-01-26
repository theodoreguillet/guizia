'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/app/client';
import { createWallet } from 'thirdweb/wallets';
import { sonicBlaze } from '@/chains/sonic-blaze';

/**
 * Navigation bar that shows up on all pages.
 */
export function Navbar() {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/">
            <span className="font-bold text-2xl">GUIZIA</span>
          </Link>
        </div>
        <div className={styles.navRight}>
          <h4 className={styles.hideLink}>
            <Link href="/faq">How it works</Link>
          </h4>
          <h4>
            <ConnectButton
              client={client}
              appMetadata={{
                name: 'Guizia',
                url: 'https://guizia.io',
              }}
              wallets={[createWallet('io.rabby'), createWallet('io.metamask')]}
              chain={sonicBlaze}
            />
          </h4>
        </div>
      </nav>
    </div>
  );
}
