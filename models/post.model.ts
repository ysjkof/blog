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
  content: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface Tags extends Category {}
