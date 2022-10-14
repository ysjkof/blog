import type { NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '../utils/fetcher';
import { Post } from '../models/post.model';
import { getMetadatas, getPostFile, getPostFiles } from '../utils/posts.utils';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

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
  const pasredMarkdown = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(getPostFile(filename));

  return {
    props: {
      fallback: {
        [`/api/posts/${params.post}`]: {
          ...metadata,
          post: pasredMarkdown.value,
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
