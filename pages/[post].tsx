import type { NextPage } from 'next';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { unified } from 'unified';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import matter from 'gray-matter';
import { getPostDir, getPostsDir } from '../utils/util';

const Post: NextPage<{ post: any; frontMatter: any }> = ({
  post,
  frontMatter,
}) => {
  const { title, categories, date, tags } = frontMatter;
  return (
    <div>
      <main>
        <header>
          <div>
            <span>{title}</span>
          </div>
          <div>
            <span>{date}</span>
          </div>
          <div>
            <span>분류</span>
            <ul>
              {categories.map((category: string) => (
                <li key={category} style={{ display: 'block' }}>
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span>태그</span>
            <ul>
              {tags.map((tag: string) => (
                <li key={tag} style={{ display: 'block' }}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <article dangerouslySetInnerHTML={{ __html: post }}></article>
      </main>
    </div>
  );
};

export async function getStaticPaths() {
  const { posts } = getPostsDir();

  const paths = posts.map((filename) => {
    const post = filename.replace(/\.md/, '');
    return {
      params: { post },
    };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: Params) {
  const postFile = getPostDir(`${params.post}.md`);

  const post = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(postFile);

  const { data } = matter(postFile);

  return {
    props: {
      post: post.value,
      frontMatter: data,
    },
  };
}

export default Post;
