export interface PostMetadata {
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  pathname: string;
  publishedDate: string;
  lastModifiedAt: string;
}

export interface Post extends PostMetadata {
  post: string;
}
