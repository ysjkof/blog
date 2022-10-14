import type { NextPage } from 'next';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '../utils/fetcher';
import { Post } from '../models/post.model';

const Post: NextPage = () => {
  const { query } = useRouter();
  const { data } = useSWR<Post>(`/api/posts/${query.post || null}`, fetcher);

  return (
    <div>
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
        <article
          dangerouslySetInnerHTML={{ __html: data?.post || '' }}
        ></article>
      </main>
    </div>
  );
};

export default Post;
