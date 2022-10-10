# Blog with NestJS

## 구현기능

- [x] `/` - 목록 페이지
- [x] `/[id]` - 상세 페이지
- [x] 마크다운 파서(`remark`)를 이용해 포스팅 출력
- [x] 각 마크다운의 meta data는 `gray-matter`, `frontmatter` 참고
- [ ] (추가 구현) 코드 하이라이터는 `highlight.js`, `prism.js` 를 참고

---

**:: Next.js에서 지원하는 Prefetching 메서드를 적절히 사용해주세요.**

- 정적 페이지를 생성할 때 필요한 데이터 생성 → `getStaticProps`
- 각 포스트를 그려줄 상세 페이지 경로를 생성 → `getStaticPaths`

**:: 참고 사항**

- 가급적 TypeScript로 진행하시는 걸 추천드립니다.
- 과제의 목적이 디자인에 있지는 않기 때문에 UI 관련 라이브러리는 자유롭게 사용하셔도 좋습니다. 단, 라이브러리의 종류와 Next.js 간 호환이 잘 맞지 않아 에러가 발생하는 경우가 있을 수 있으니 유의하여 사용해주세요.
- CSS-in-JS 라이브러리 사용 시 `_document.js`(Next.js 공식 문서 참고)에 각 라이브러리(`styled-components`, `emotion`, …)에 알맞은 세팅을 추가해주세요.
- [Vercel](https://vercel.com/)이나 [Netlify](https://www.netlify.com/)를 활용하면 정적 페이지를 간단하게 배포할 수 있습니다.
- 과제 완료 후 과제 제출 페이지에 해당 프로젝트의 github 링크로 제출해주세요. 프로젝트에 대한 간단한 소개가 README에 작성되어 있으면 좋습니다.
- 이 외에 추가 구현하고 싶은 기능이 있으면 자유롭게 구현해주세요.
