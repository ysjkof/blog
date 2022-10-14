import fs from 'fs';
import matter from 'gray-matter';
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

export function getMetadata(postFiles: string[]) {
  return postFiles
    .map((postFile) => {
      return matter(getPostFile(postFile)).data;
    })
    .map((post, index) => {
      return { ...post, pathname: postFiles[index].replace(/\.md/, '') };
    });
}
