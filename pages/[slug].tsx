import type { NextPage } from 'next';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import type { Post } from '../models/post.model';
import { unstable_serialize } from 'swr';
import { parseMarkdown } from '../utils/markdown.utils';
import { getMetadata, getPostFiles } from '../utils/posts.utils';
import PostDetail from '../components/PostDetail';

export async function getStaticPaths() {
  const postFiles = getPostFiles();
  const paths = postFiles.map((filename) => ({
    params: { slug: filename.replace(/\.md/, '') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: Params) {
  const { slug } = params;
  if (typeof slug !== 'string') {
    return { props: {} };
  }

  const filename = slug + '.md';
  const metadata = getMetadata(filename);
  const parsedMarkdown = await parseMarkdown(filename);

  const post = Object.assign({ content: parsedMarkdown }, metadata);

  return {
    props: {
      fallback: {
        [unstable_serialize(['posts', slug])]: post,
      },
    },
  };
}

const Post: NextPage = () => {
  return <PostDetail />;
};

export default Post;
