import fs from 'fs';
import path from 'path';

function getPostsPath() {
  const rootDir = process.cwd();
  const FOLDER_NAME = '__posts';

  return path.join(rootDir, FOLDER_NAME);
}

export function getPostFiles() {
  const postsPath = getPostsPath();
  const posts = fs.readdirSync(postsPath, 'utf-8');
  return posts;
}

export function getPostFile(filename: string) {
  const postsPath = getPostsPath();
  const postPath = path.join(postsPath, filename);
  const postFile = fs.readFileSync(postPath, 'utf-8');
  return postFile;
}
