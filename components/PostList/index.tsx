import { PostMetadata } from '../../models/post.model';
import { getUniqueValue } from '../../services/posts.services';
import { Categories } from './Categories';
import { PostCard } from './PostCard';
import { Tags } from './Tags';

function PostList({ data }: { data: PostMetadata[] }) {
  const tags = getUniqueValue(data, 'tags');
  const categories = getUniqueValue(data, 'categories');

  return (
    <main>
      <h1 className="text-center">Next SSG Blog</h1>
      <Categories categories={categories} />
      <Tags tags={tags} />
      <h2 className="text-center">Posts</h2>
      <ul className="h-full w-full space-y-4 py-4 px-1">
        {data.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
      </ul>
    </main>
  );
}

export { Categories, PostCard, Tags };
export default PostList;
