import Link from 'next/link';
import type { Category } from '../../models/post.model';

export function Categories({ categories }: { categories: Category[] }) {
  return (
    <>
      <h2 className="text-center">Categories</h2>
      <ul className="flex flex-wrap gap-4 px-6 py-4">
        {categories.map((tag) => {
          const { name, count } = tag;
          return (
            <Link key={name} href={`/tags/${name}`}>
              <a className="space-x-0.5 text-xs text-gray-500 hover:font-semibold hover:text-gray-600">
                <span>@{name}</span>
                <span>({count})</span>
              </a>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
