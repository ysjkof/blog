export interface PostMetadata {
  categories: string[];
  date: string;
  description: string;
  slug: string;
  tags: string[];
  title: string;
  pathname: string;
}

export interface Post extends PostMetadata {
  post: string;
}
