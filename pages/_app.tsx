import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import '../styles/globals.css';
import '../styles/github.css';
import GlobalNavigationBar from '../components/GlobalNavigationBar';
import GoogleAnalytics from '../components/GoogleAnalytics';

function MyApp({ Component, pageProps }: AppProps<{ fallback: any }>) {
  const { fallback } = pageProps;

  return (
    <>
      <GoogleAnalytics />
      <Head>
        <title>Blog</title>
        <meta name="description" content="Web Developer Personal Blog" />
      </Head>
      <SWRConfig value={{ fallback }}>
        <GlobalNavigationBar />
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default MyApp;
