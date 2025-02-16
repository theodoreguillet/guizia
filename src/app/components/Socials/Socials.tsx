'use client';

import Link from 'next/link';
import styles from './Socials.module.css';

/**
 * Social buttons , X and Contract.
 */
export function Socials() {
  return (
    <div className={styles.socialsContainer}>
      <div></div>

      <div className="flex flex-row items-center gap-3">
        <Link
          href="https://x.com/GuiziaAI"
          target="_blank"
          className={styles.socialsButton}
        >
          X
        </Link>
        <Link href="/terminal" className={styles.socialsButton}>
          Terminal
        </Link>
      </div>
    </div>
  );
}
