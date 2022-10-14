import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import useSWR, { SWRConfig } from 'swr';
import { PostMetadata } from '../models/post.model';
import { fetcher } from '../utils/fetcher';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';

export async function getStaticProps() {
  const postFiles = getPostFiles();
  const postsMetadata = getMetadatas(postFiles);

  return {
    props: {
      fallback: {
        '/api/posts': postsMetadata,
      },
    },
  };
}

function Main() {
  const { data } = useSWR<PostMetadata[]>('/api/posts', fetcher);

  return (
    <main>
      <h1>Next SSG Blog</h1>
      <h2>Posts</h2>
      <ul>
        {data?.map((post) => (
          <li key={post.title}>
            <Link href={post.pathname}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Head>
        <title>Next Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </SWRConfig>
  );
};

export default Home;
