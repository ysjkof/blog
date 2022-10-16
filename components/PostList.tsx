import dynamic from 'next/dynamic';
import Link from 'next/link';
import useSWR from 'swr';
import { PostMetadata } from '../models/post.model';
const RowList = dynamic(() => import('../components/RowList'), { ssr: false });
const Loading = dynamic(() => import('./Loading'), {
  ssr: false,
});

export default function PostList() {
  const { data } = useSWR<PostMetadata[]>(['posts']);
  if (!data) return <Loading />;

  return (
    <main>
      <h1 className="text-center">Next SSG Blog</h1>
      <h2 className="text-center">Posts</h2>
      <ul className="h-full w-full space-y-4 py-4 px-1">
        {data.map((post) => {
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
        })}
      </ul>
    </main>
  );
}
