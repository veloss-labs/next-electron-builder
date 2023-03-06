import React, {useCallback, useEffect} from 'react';
import Image from 'next/image';
import styles from '~/assets/modules/Home.module.css';
import {useRouter} from 'next/router';

export default function Home() {
  useEffect(() => {
    console.log('hi');
  }, []);

  const onSayHiClick = useCallback(() => {
    console.log('hi');
  }, []);

  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code
            data-testid="code"
            className={styles.code}
          >
            pages/index.tsx
          </code>
          <button onClick={onSayHiClick}>Say Hi</button>
          <button onClick={() => router.push('/')}>Move To Index</button>
          {router.pathname}
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/images/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/images/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image
            src="/images/thirteen.svg"
            alt="13"
            width={40}
            height={31}
            priority
          />
        </div>
      </div>

      <div className={styles.gap}></div>
    </main>
  );
}
