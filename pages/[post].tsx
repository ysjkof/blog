import type { NextPage } from 'next';
import fs from 'fs';
import path from 'path';

const Post: NextPage<{ posts: any }> = ({ posts }) => {
  console.log('posts', posts);

  return (
    <div>
      <main></main>
    </div>
  );
};

export async function getStaticPaths() {
  const _root = process.cwd();
  const FOLDER_NAME = '__posts';
  const _postsDir = path.join(_root, FOLDER_NAME);
  const posts = fs.readdirSync(_postsDir, 'utf-8');
  const paths = posts.map((filename) => ({
    params: { post: filename.replace(/\.md/, '') },
  }));

  return { paths, fallback: false };
}

export default Post;
