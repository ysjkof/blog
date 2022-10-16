import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import '../styles/globals.css';
import '../styles/github.css';

function MyApp({ Component, pageProps }: AppProps<{ fallback: any }>) {
  const { fallback } = pageProps;

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Web Developer Personal Blog" />
      </Head>
      <SWRConfig value={{ fallback }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default MyApp;
