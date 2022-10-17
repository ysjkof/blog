import Link from 'next/link';
import type { Tags } from '../../models/post.model';

export function Tags({ tags }: { tags: Tags[] }) {
  return (
    <>
      <h2 className="text-center">Tags</h2>
      <ul className="flex flex-wrap gap-4 px-6 py-4">
        {tags.map((tag) => {
          const { name, count } = tag;
          return (
            <Link key={name} href={`/tag/${name}`}>
              <a className="space-x-0.5 text-xs text-gray-500 hover:font-semibold hover:text-gray-600">
                <span>#{name}</span>
                <span>({count})</span>
              </a>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
