import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner
 */
export function LoadingSpinner() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}
