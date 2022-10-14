import { ReactNode } from 'react';

export default function RowList({
  lists,
  listSymbol,
  children,
}: {
  lists: string[];
  listSymbol: '@' | '#';
  children?: ReactNode;
}) {
  return (
    <div className="mb-1 flex justify-between text-xs text-gray-600">
      <ul className="flex gap-4">
        {lists.map((list) => (
          <li key={list}>
            {listSymbol}
            {list}
          </li>
        ))}
      </ul>
      {children && children}
    </div>
  );
}
