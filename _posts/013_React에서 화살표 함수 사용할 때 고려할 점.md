---
title: React에서 화살표 함수 사용할 때 고려할 점
description: 전통적인 함수는 타입스크립트 제네릭을 쓸 때, React.lazy로 코드 쪼개기할 때 쓰고 나머지는 화살표 함수를 쓰기로 한다. 다만 이때 export default 방식에 유의할 것.
categories: [규칙]
tags: [React, 화살표함수]
publishedDate: 2022/11/30
lastModifiedAt: 2022/11/30
---

# React에서 화살표 함수 사용할 때 고려할 점

자바스크립트는 함수를 표현하는 두 가지 방법이 있다.

- [전통적인 함수(function)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/function)
- [화살표 함수(arrow function)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

화살표 함수가 function을 안써도 되서 타자량이 적고 가독성이 좋은 경우가 많다.

리액트 코딩 하다가 둘 중에 뭘 언제 쓸지 명확하지 않아 정리한다.

## function을 쓸 때

### - 타입스크립트의 제네릭을 사용할 때

화살표 함수는 제네릭을 사용할 때 작동하지 않는다.

```ts
// 작동함.
function changeValueInArray<T>(array: T[], value: T, index: number) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

// 작동안함.
const changeValueInArray<T> = (array: T[], value: T, index: number) => {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
//
```

### - React.lazy로 코드 쪼개기(code splitting) 할 때

React.lazy는 **export default**일 때 작동하기 때문에 한 파일에서 **named export**를 관리한다면 default로 바꿔주는 중간 모듈을 써야해서 번거롭다.

아래는 기본 사용 방법;

```js
// ./components/Home.tsx
export default function Home () { return ... }

// ./App.tsx
import { lazy } from 'react';
const Home = lazy(() => import('./components/home.tsx'));
```

아래는 중간모듈을 사용하는 방법. 쪼갤 함수의 수만큼 중간모듈을 만들어야 하기 때문에 하나의 파일에서 export를 관리할 수 없다. [공식문서](https://reactjs.org/docs/code-splitting.html#named-exports)

```ts
// ./components/Home.tsx
export const Home = () => { return ... }

// ./components/Room.tsx
export const Room = () => { return ... }

// ./components/index.ts
import { Home } from './Home';
import { Room } from './Room';

export {
    Home as default, // 한 파일의 default는 하나만 가능하다.
    Room
}

// ./App.tsx
import { lazy } from 'react';
const Home = lazy(() => import('./components'));
```

그래서 index.ts에 컴포넌트를 모아서 named export할 경우 컴포넌트는 default export해야 lazy를 쓰기 편하고 여전히 콘솔에서 컴포넌트 이름도 볼 수 있다.

### - 객체 메소드

더 사용해보고 결정.

```js
const Home = {
  open() {
    ...
  },
  close: () => {
    ...
  }
}
```

## arrow function을 쓸 때

타입스크립트 제네릭이 아닌 경우 모두 화살표 함수를 쓴다.

이때 **default export**를 신경써야 한다.

- 전통적인 함수는 `export default function Home (){...}`가 작동하지만,
- 화살표 함수는 `export default const Home = () => {...}`가 작동하지 않는다.

  따라서 화살표 함수는 선언 후 줄 바꾸고 `export default`를 해야 한다.

```js
export default function Home () { return ... } // 작동함

export default const Home = () => { return ... } // 작동안함

// 작동함
const Home = () => { return ... }
export default Home
```
