import '~/assets/globals.css';
import React from 'react';

import {Inter} from 'next/font/google';

// types
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface AppPropsWithLayout extends AppProps, Pick<NextPage, 'getInitialProps'> {
  Component: NextPageWithLayout;
}

const inter = Inter({subsets: ['latin'], variable: '--inter-font'});

export default function App({Component, pageProps}: AppPropsWithLayout) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
