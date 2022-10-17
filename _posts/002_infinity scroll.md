---
title: 무한 스크롤(infinity scroll)
description:
categories: [개념]
tags: [무한스크롤, 최적화]
publishedDate: 2022/07/12
lastModifiedAt: 2022/07/12
---

# 무한 스크롤(infinity scroll)

브라우저의 스크롤이 화면의 끝에 갔을 때 자료를 더 불러와서 정보를 더 표현하는 기능

- 한 번에 화면 크기 정도의 자료를 불러오고 필요할 때(화면 끝에 갔을 때) 더 정보를 불러온다.
- 백엔드에서 받을 자료를 조금씩 요청하기 때문에 데이터량을 절약한다.
- 백엔드에서 자료를 조금씩 받기 때문에 클라이언트의 부하가 감소한다.

```tsx
// useIntersectionObserver.ts
import { useEffect } from 'react';

const options = {
  root: null, // 뷰포트로 사용할 요소, 기본값은 브라우저의 뷰포트. react의 useRef나 querySelector로 html element를 정할 수 있다
  rootMargin: '0px', // 기본값은 0. 단위는 px나 % 사용
  threshold: 0.5, // 요소의 몇 %가 보일때 작동할 것인지(0~1 사이의 값)
};

const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement>,
  calback: () => void
) => {
  const intersectionCalback = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) calback();
  };
  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCalback, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);
  return [ref];
};
export default useIntersectionObserver;

// ...

// Home.tsx
function Home() {
  const { getMovies, movies } = useMovie();
  const [pageNumber, setPageNumber] = useState(1);

  const intersectionRef = useRef < HTMLDivElement > null;
  const intersectionCalback = () => {
    // 2. setPageNumber가 작동한다
    setPageNumber((prev) => prev + 1);
  };
  useIntersectionObserver(intersectionRef, intersectionCalback);

  useEffect(() => {
    // 3. setPageNumber가 작동하면 pageNumber를 useEffect가 감지하고 변한 pageNumber로 getMovies를 수행한다
    getMovies(pageNumber);
  }, [pageNumber]);

  return (
    <div>
      <Movies>
        // 4. getMovies가 새로운 movies를 반환하고 Movie가 추가된다
        {movies?.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </Movies>
      // 1. IntersectionArea이 뷰포트에 나타나면,
      <IntersectionArea ref={intersectionRef} />
    </div>
  );
}
```
