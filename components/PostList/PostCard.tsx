import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { PostMetadata } from '../../models/post.model';
const RowList = dynamic(() => import('../RowList'), { ssr: false });

export function PostCard({ post }: { post: PostMetadata }) {
  const {
    categories,
    description,
    lastModifiedAt,
    pathname,
    publishedDate,
    tags,
    title,
  } = post;

  return (
    <li
      key={title}
      className="post-title w-full rounded-2xl border px-5 py-1 shadow hover:border-transparent hover:ring-2 hover:ring-blue-500"
    >
      <RowList lists={tags} listSymbol="#">
        <span>발행: {publishedDate}</span>
      </RowList>
      <RowList lists={categories} listSymbol="@">
        <span>수정: {lastModifiedAt}</span>
      </RowList>
      <Link href={pathname}>{title}</Link>
      <p className="mb-2 text-sm text-gray-600">{description}</p>
    </li>
  );
}
