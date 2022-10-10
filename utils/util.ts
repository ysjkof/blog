import fs from 'fs';
import path from 'path';

const FOLDER_NAME = '__posts';

export function getPostsDir() {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, FOLDER_NAME);
  const posts = fs.readdirSync(postsDir, 'utf-8');

  return { postsDir, posts };
}

export function getPostDir(filename: string) {
  const { postsDir } = getPostsDir();
  const postDir = path.join(postsDir, filename);
  const postFile = fs.readFileSync(postDir, 'utf-8');
  return postFile;
}
