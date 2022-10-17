import Link from 'next/link';

function GlobalNavigationBar() {
  return (
    <div className="h-12 border-b shadow-sm flex items-center justify-center">
      <h1 className="text-2xl">
        <Link href="/">개발 블로그</Link>
      </h1>
    </div>
  );
}

export default GlobalNavigationBar;
