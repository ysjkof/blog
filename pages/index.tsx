import type { NextPage } from 'next';
import type { PostMetadata } from '../models/post.model';
import dynamic from 'next/dynamic';
import useSWR, { unstable_serialize } from 'swr';
import { getMetadatas, getPostFiles, sortMetadata } from '../utils/posts.utils';
import PostList from '../components/PostList';
const Loading = dynamic(() => import('../components/Loading'), {
  ssr: false,
});

export async function getStaticProps() {
  const postFiles = getPostFiles();
  const postsMetadata = getMetadatas(postFiles);

  return {
    props: {
      fallback: {
        [unstable_serialize(['posts'])]: sortMetadata(postsMetadata),
      },
    },
  };
}

const Home: NextPage = () => {
  const { data } = useSWR<PostMetadata[]>(['posts']);
  if (!data) return <Loading />;

  return <PostList data={data}></PostList>;
};

export default Home;
