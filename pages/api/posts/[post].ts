import type { NextApiRequest, NextApiResponse } from 'next';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { getMetadata, getPostFile } from '../../../utils/posts.utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query } = req;
    if (!query.post || query.post === 'null') {
      res.status(400).json('쿼리가 잘못됐습니다.');
      return;
    }

    const filename = query.post + '.md';
    const metadata = getMetadata([filename]);

    const pasredMarkdown = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(getPostFile(filename));

    res.status(200).json({ ...metadata[0], post: pasredMarkdown.value });
  } catch (error) {
    console.error('✅ 에러 발생 ->', error);
  }
}
