import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import matter from 'gray-matter';
import { getPostDir, getPostsDir } from '../utils/util';

const Home: NextPage<{
  posts: { [key: string]: string }[];
}> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Next Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Next SSG Blog</h1>
        <h2>Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.title}>
              <Link href={post.pathname}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const { posts } = getPostsDir();

  const frontMatters = posts
    .map((post) => {
      const postFile = getPostDir(post);
      return matter(postFile).data;
    })
    .map((post, index) => {
      return { ...post, pathname: posts[index].replace(/\.md/, '') };
    });

  return { props: { posts: frontMatters } };
}

export default Home;
