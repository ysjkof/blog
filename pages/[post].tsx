import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import type { Post } from '../models/post.model';
import useSWR, { SWRConfig } from 'swr';
import { fetcher } from '../utils/fetcher';
import { parseMarkdown } from '../utils/markdown.utils';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';
const RowList = dynamic(() => import('../components/RowList'), { ssr: false });
const Loading = dynamic(() => import('../components/Loading'), {
  ssr: false,
});

export async function getStaticPaths() {
  const postFiles = getPostFiles();

  const paths = postFiles.map((filename) => {
    const post = filename.replace(/\.md/, '');
    return {
      params: { post },
    };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: Params) {
  const filename = params.post + '.md';
  const metadata = getMetadatas(filename);
  const parsedMarkdown = await parseMarkdown(filename);

  return {
    props: {
      fallback: {
        [`/api/posts/${params.post}`]: {
          ...metadata,
          post: parsedMarkdown.value,
        },
      },
    },
  };
}

function Main() {
  const { query } = useRouter();
  const { data } = useSWR<Post>(`/api/posts/${query.post || null}`, fetcher);
  if (!data) return <Loading />;

  const { categories, lastModifiedAt, post, publishedDate, tags, title } = data;
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
          dangerouslySetInnerHTML={{ __html: post || '' }}
          className="prose mx-auto my-10"
        />
      </main>
    </>
  );
}

const Post: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Main />
    </SWRConfig>
  );
};

export default Post;
