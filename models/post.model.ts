export interface PostMetadata {
  categories: string[];
  date: string;
  description: string;
  slug: string;
  tags: string[];
  title: string;
}

export interface Post extends PostMetadata {
  pathname: string;
}
