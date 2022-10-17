import type { NextPage } from 'next';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import type { Post } from '../../models/post.model';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR, { unstable_serialize } from 'swr';
import {
  getMetadatas,
  getPostFiles,
  sortMetadata,
} from '../../utils/posts.utils';
import { getUniqueValue } from '../../services/posts.services';
import PostList from '../../components/PostList';
const Loading = dynamic(() => import('../../components/Loading'), {
  ssr: false,
});

export async function getStaticPaths() {
  const postFiles = getPostFiles();
  const postsMetadata = getMetadatas(postFiles);
  const categories = getUniqueValue(postsMetadata, 'categories');

  const paths = categories.map((category) => ({
    params: { slug: category.name },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: Params) {
  const { slug } = params;
  if (typeof slug !== 'string') {
    return { props: {} };
  }

  const postFiles = getPostFiles();
  const postsMetadata = getMetadatas(postFiles, { category: slug });

  return {
    props: {
      fallback: {
        [unstable_serialize(['category', slug])]: sortMetadata(postsMetadata),
      },
    },
  };
}

const Category: NextPage = () => {
  const { query } = useRouter();
  const { data } = useSWR<Post[]>(['category', query.slug]);
  if (!data) return <Loading />;

  return <PostList data={data} />;
};

export default Category;
