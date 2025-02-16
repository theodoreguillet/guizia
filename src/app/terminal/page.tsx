'use client';

import React, { useEffect, useState } from 'react';
import styles from './Terminal.module.css';
import { useLoading } from '../components/LoadingContext/LoadingContext';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

export default function Terminal() {
  const { loading, setLoading } = useLoading();
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    // Fetch tweets
    async function fetchTweets() {
      setLoading(true);
      const response = await fetch('/api/tweets');
      const data = await response.json();
      setLoading(false);
      setTweets(data);
    }

    fetchTweets();
  }, []);

  return (
    <>
      {loading ? (
        <span>Loading Terminal...</span>
      ) : (
        <div className={styles.terminalContainer}>
          <p className="font-bold text-5xl mb-10">Terminal</p>
          <div className={styles.tweets}>
            {tweets.map((tweet) => (
              <div key={tweet.id} className={styles.tweet}>
                <p>{tweet.text}</p>
                <p className={styles.timestamp}>
                  {new Date(tweet.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
