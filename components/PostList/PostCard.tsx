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
      <div className="flex gap-4">
        <RowList lists={categories} listSymbol="@"></RowList>
        <span className="text-xs text-gray-600 mb-1">||</span>
        <RowList lists={tags} listSymbol="#"></RowList>
      </div>
      <div className="flex gap-6">
        <span className="text-sm text-gray-600 mb-1">
          발행: {publishedDate}
        </span>
        <span className="text-sm text-gray-600 mb-1">
          수정: {lastModifiedAt}
        </span>
      </div>
      <Link href={pathname}>{title}</Link>
      <p className="mb-2 text-sm text-gray-600">{description}</p>
    </li>
  );
}
