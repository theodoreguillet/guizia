'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { ThirdwebConnectButton } from '../ConnectButton/ConnectButton';

/**
 * Navigation bar that shows up on all pages.
 */
export function Navbar() {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/">
            <span className="font-bold text-2xl">guizia</span>
          </Link>
        </div>
        <div className={styles.navRight}>
          <h4 className={styles.hideLink}>
            <Link href="/collection">Collection</Link>
          </h4>
          <h4 className={styles.hideLink}>
            <Link href="/faq">How it works</Link>
          </h4>
          <h4>
            <ThirdwebConnectButton />
          </h4>
        </div>
      </nav>
    </div>
  );
}
