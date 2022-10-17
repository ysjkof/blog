import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { PostMetadata } from '../models/post.model';

function getPostsPath() {
  const rootDir = process.cwd();
  const FOLDER_NAME = '_posts';

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

interface MetadataOption {
  tag?: string;
  category?: string;
}
/**
 * @param postFiles 전체 경로가 아닌 확장자가 포함된 파일 이름.
 */
export function getMetadata(postFile: string, options?: MetadataOption) {
  const metadata = matter(getPostFile(postFile)).data as PostMetadata;

  if (options) {
    const { category, tag } = options;

    if (tag && metadata.tags.includes(tag)) {
      return {
        ...metadata,
        pathname: postFile.replace(/\.md/, ''),
      };
    }
    if (category && metadata.categories.includes(category)) {
      return {
        ...metadata,
        pathname: postFile.replace(/\.md/, ''),
      };
    }
    return null;
  }

  return {
    ...metadata,
    pathname: postFile.replace(/\.md/, ''),
  };
}

export function getMetadatas(postFiles: string[], options?: MetadataOption) {
  const metadatas: PostMetadata[] = [];

  postFiles.forEach((postFile) => {
    const metadata = getMetadata(postFile, options);
    if (metadata) metadatas.push(metadata);
  });

  return metadatas;
}

export function sortMetadata(metadata: PostMetadata[]) {
  return metadata.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}
