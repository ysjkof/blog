import type { NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '../utils/fetcher';
import { Post } from '../models/post.model';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { parseMarkdown } from '../utils/markdown.utils';
import Head from 'next/head';
import Loading from '../components/Loading';

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

function SmallList({ lists, symbol }: { lists?: string[]; symbol: '#' | '@' }) {
  return (
    <ul className="flex justify-end gap-6">
      {lists?.map((list, i) => (
        <li key={i}>
          {symbol}
          {list}
        </li>
      ))}
    </ul>
  );
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
      <main className="mx-auto">
        <header className="text-gray-600 border-b px-10 text-sm">
          <div className="flex justify-end gap-6">
            <span>발행: {publishedDate}</span>
            <span>수정: {lastModifiedAt}</span>
          </div>
          <SmallList lists={tags} symbol="#" />
          <SmallList lists={categories} symbol="@" />
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
