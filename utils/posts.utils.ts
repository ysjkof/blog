import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

function getPostsPath() {
  const rootDir = process.cwd();
  const FOLDER_NAME = '__posts';

  return path.join(rootDir, FOLDER_NAME);
}

/**
 * @returns posts 폴더의 모든 파일들
 */
export function getPostFiles() {
  const postsPath = getPostsPath();
  const posts = fs.readdirSync(postsPath, 'utf-8');
  return posts;
}

/**
 * @param filename 확장자가 포함된 파일 이름
 * @returns posts 폴더의 해당 파일의 전체 경로
 */
export function getPostFile(filename: string) {
  const postsPath = getPostsPath();
  const postPath = path.join(postsPath, filename);
  const postFile = fs.readFileSync(postPath, 'utf-8');
  return postFile;
}

/**
 * @param postFiles 전체 경로가 아닌 확장자가 포함된 파일 이름.
 */
export function getMetadata(postFiles: string[]) {
  return postFiles
    .map((postFile) => {
      return matter(getPostFile(postFile)).data;
    })
    .map((post, index) => {
      return { ...post, pathname: postFiles[index].replace(/\.md/, '') };
    });
}
