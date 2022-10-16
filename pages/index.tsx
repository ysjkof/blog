import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import useSWR, { unstable_serialize } from 'swr';
import { Categories, PostCard, TagList } from '../components/PostList';
import { PostMetadata } from '../models/post.model';
import { getUniqueValue } from '../services/posts.services';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';
const Loading = dynamic(() => import('../components/Loading'), {
  ssr: false,
});

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
  const { data } = useSWR<PostMetadata[]>(['posts']);
  if (!data) return <Loading />;

  const tags = getUniqueValue(data, 'tags');
  const categories = getUniqueValue(data, 'categories');

  return (
    <main>
      <h1 className="text-center">Next SSG Blog</h1>
      <Categories categories={categories} />
      <TagList tags={tags} />
      <h2 className="text-center">Posts</h2>
      <ul className="h-full w-full space-y-4 py-4 px-1">
        {data.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
      </ul>
    </main>
  );
};

export default Home;
