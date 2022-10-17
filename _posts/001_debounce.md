---
title: 디바운스란? (Debounce)
description:
categories: [개념]
tags: [디바운스, 최적화]
publishedDate: 2022/07/12
lastModifiedAt: 2022/07/12
---

# 디바운스란? (debounce)

`사과`를 검색한다면 ㅅ, ㅏ, ㄱ, ㅗ, ㅏ 이렇게 자모음 한자씩 입력할때마다 api를 불러올 필요는 없다. 그래서 문장을 전부 완성하고 나서 작업을 수행할 수 있게 하는 기능이다.

- 연속된 이벤트가 발생할 경우 마지막 이벤트 한 번만 실행한다.
- javascript `setTimeout`으로 단순하게 구현할 수 있다.
- [lodash](https://lodash.com/)에 디바운스 기능이 있다. `setTimeout`이 아니다.

```js
// debounce.js
let timer = undefined;
let apiCallNumber = 0;

function debouunce(callback, { timeout = 500 }) {
  const timerHandler = () => {
    callback();
    apiCallNumber = apiCallNumber + 1;
    console.log('Api call number :', apiCallNumber);
  };

  if (timer) clearTimeout(timer);
  timer = setTimeout(timerHandler, timeout);
}

export default debouunce;

// SearchForm.jsx
// ...
const [words, setWords] = useState([]);
const searchInputRef = useRef(null);

const getAutoComplete = (event) => {
  event.preventDefault();

  const term = searchInputRef.current?.value;
  function invokeAutoComplete() {
    if (!term) return setWords([]);

    // checkFuzzyStringMatch()이 비용이 큰 작업이라면 수행을 최소화한다
    let titles = checkFuzzyStringMatch(term);
    if (isZeroLengthArray(titles)) titles = ['검색어 없음'];
    setWords(titles);
  }

  debouunce(invokeAutoComplete, { timeout: 200 });
};

return (
  <form>
    <input type={'search'} ref={searchInputRef} onChange={getAutoComplete} />
  </form>
);
```
