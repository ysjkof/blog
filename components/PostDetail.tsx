import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { Post } from '../models/post.model';
const RowList = dynamic(() => import('./RowList'), { ssr: false });
const Loading = dynamic(() => import('./Loading'), {
  ssr: false,
});

export default function PostDetail() {
  const { query } = useRouter();
  const { data } = useSWR<Post>(['posts', query.slug]);
  if (!data) return <Loading />;

  const { categories, lastModifiedAt, content, publishedDate, tags, title } =
    data;
  return (
    <>
      <Head>
        <title>{title || '게시글'}</title>
      </Head>
      <main className="mx-auto mt-4">
        <header className="text-gray-600 border-b px-10 text-sm">
          <div className="flex gap-6 mb-1">
            <span>발행: {publishedDate}</span>
            <span>수정: {lastModifiedAt}</span>
          </div>
          <RowList lists={tags} listSymbol="#" />
          <RowList lists={categories} listSymbol="@" />
          <h1 className="text-3xl text-center font-semibold">{title}</h1>
        </header>

        <article
          dangerouslySetInnerHTML={{ __html: content || '' }}
          className="prose mx-auto my-10"
        />
      </main>
    </>
  );
}
