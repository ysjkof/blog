import type { NextPage } from 'next';
import { unstable_serialize } from 'swr';
import PostList from '../components/PostList';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';

export async function getStaticProps() {
  const postFiles = getPostFiles();
  const postsMetadata = getMetadatas(postFiles);

  return {
    props: {
      fallback: {
        [unstable_serialize(['posts'])]: postsMetadata,
      },
    },
  };
}

const Home: NextPage = () => {
  return <PostList />;
};

export default Home;
