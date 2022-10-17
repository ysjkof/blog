export default function RowList({
  lists,
  listSymbol,
}: {
  lists: string[];
  listSymbol: '@' | '#';
}) {
  return (
    <ul className="flex gap-4 text-xs text-gray-600 mb-1">
      {lists.map((list) => (
        <li key={list}>
          {listSymbol}
          {list}
        </li>
      ))}
    </ul>
  );
}
