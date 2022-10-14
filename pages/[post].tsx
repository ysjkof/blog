import type { NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '../utils/fetcher';
import { Post } from '../models/post.model';
import { getMetadatas, getPostFiles } from '../utils/posts.utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { parseMarkdown } from '../utils/markdown.utils';

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

  return (
    <main>
      <header>
        <div>
          <span>{data?.title}</span>
        </div>
        <div>
          <span>{data?.date}</span>
        </div>
        <div>
          <span>분류</span>
          <ul>
            {data?.categories.map((category: string) => (
              <li key={category} style={{ display: 'block' }}>
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span>태그</span>
          <ul>
            {data?.tags.map((tag: string) => (
              <li key={tag} style={{ display: 'block' }}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <article dangerouslySetInnerHTML={{ __html: data?.post || '' }}></article>
    </main>
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
