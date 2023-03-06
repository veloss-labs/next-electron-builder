import React, {useCallback} from 'react';
import Image from 'next/image';
import styles from '~/assets/modules/Home.module.css';
import {useRouter} from 'next/router';

export default function Home() {
  const onSayHiClick = useCallback(async () => {
    const url = await window.__ELECTRON_EXPOSURE__.getServerUrl();
    const resp = await fetch(url + 'api/hello');
    const data = await resp.json();
    console.log('data', data);
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
          <button onClick={() => router.push('/good')}>Move To Goo</button>
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

      <div className={styles.grid}>
        <a
          href="https://www.electronjs.org"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Eelectron <span>-&gt;</span>
          </h2>
          <p>Build cross-platform desktop apps with JavaScript, HTML, and CSS</p>
        </a>

        <a
          href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>Instantly deploy your Next.js site to a shareable URL with Vercel.</p>
        </a>
      </div>
    </main>
  );
}
