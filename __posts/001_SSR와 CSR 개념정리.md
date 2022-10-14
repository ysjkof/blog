---
title: SSR과 SSG, CSR 개념정리
description: SSR(Server Side Rendering), SSG(Static Site Generation), CSR(Client Side Rendering) 개념정리
categories:
  - 개념정리
tags:
  - SSR
  - SSG
  - CSR
publishedDate: 2022/10/05
lastModifiedAt: 2022/10/05
---

# SSR과 SSG, CSR 개념정리

## 목차

- [1. SSR(Server Side Rendering)과 SSG(Static Site Generation)](#1-ssrserver-side-rendering과-ssgstatic-site-generation)
- [2. CSR(Client Side Rendering)](#2-csrclient-side-rendering)
- [3. SSR과 SSG, CSR 비교](#3-ssr과-ssg-csr-비교)
  - [3a. 최초 로딩](#3a-최초-로딩)
  - [3b. 서버 부하](#3b-서버-부하)
  - [3c. TTV와 TTI의 간격](#3c-ttv와-tti의-간격)
  - [3d. SEO(Search Engin Optimization)](#3d-seosearch-engin-optimization)
  - [3e. 사용용도](#3e-사용용도)

## 1. SSR(Server Side Rendering)과 SSG(Static Site Generation)

**SSR**은 요청이 왔을 때 서버에서 **HTML을 만들어서** 클라이언트에 전송한다.

**SSG**는 요청이 왔을때 **만들어져 있는 HTML**을 클라이언트에 전송한다.

## 2. CSR(Client Side Rendering)

CSR은 HTML에 내용이 없고 자바스크립트로 HTML에 내용을 채워 넣는다. 그래서 요청이 오면 **빈 HTML**을 전송한다.

클라이언트는 HTML, 자바스크립트 순으로 코드를 다운로드하고 자바스크립트 다운로드가 끝나면 코드를 실행해서 HTML에 내용을 채워 넣는 방법을 CSR이라 한다.

## 3. SSR과 SSG, CSR 비교

| 항목             | SSR  | SSG  | CSR  |
| ---------------- | ---- | ---- | ---- |
| 최초 로딩        | 빠름 | 빠름 | 느림 |
| 서버 부하        | 크다 | 적다 | 적다 |
| TTV와 TTI의 차이 | 있음 | 있음 | 없음 |
| SEO              | 유리 | 유리 | 불리 |

🚨 위의 비교는 상대적이기 때문에 상황에 따라 체감하지 못할 수 있다. 예를들어 10ms와 50ms는 5배 차이가 나지만 사람이 느끼기 어렵다.

### 3a. 최초 로딩

**CSR**은 클라이언트에서 먼저 빈 HTML을 다운로드하고 자바스크립트를 다운로드 한 뒤에 HTML을 그리기 때문에 최초 로딩이 느리다.

**SSR과 SSG**는 현재 페이지에서 보여줄 완성된 HTML을 다운로드하기 때문에 최초 로딩이 빠르다. SSR과 SSG는 약간의 차이가 있는데 **SSR**은 요청이 왔을 때 서버에서 HTML을 만들고 클라이언트로 전송하고 **SSG**는 HTML이 만들어져 있어서 그걸 그대로 전송한다.

느린 최초 로딩 **해결방법**으로 자바스크립트 크기를 줄일 수 있다;

- Tree Shaking : 자바스크립트 소스코드에 있지만 작동에 영향을 주지 않는 코드를 제거한다.

- Code Splitting : 자바스크립트를 여러 조각으로 분리해서 요청한 페이지에서 사용하는 코드만 다운로드하도록 한다.

### 3b. 서버 부하

**HTML**을 만드는 작업을 **SSR**은 **서버에서** 하기 떄문에 서버에 부하가 더 크고, **CSR이나 SSG**는 **클라이언트에서** 하기 때문에 서버의 부하가 더 적다.

클라이언트의 부하는 서버의 부하와 반대다.

### 3c. TTV와 TTI의 간격

> TTV(Time To View)
>
> TTI(Time To Interact)

SSR은 HTML이 완성된 채로 오기 때문에 화면은 먼저 나타나지만 아직 상호작용을 담당하는 자바스크립트를 다운받고 있기 때문에 TTV와 TTI 간격이 있다. 반면 CSR은 자바스크립트를 다운받고 화면이 그려지기 때문에 간격이 없다.

### 3d. SEO(Search Engin Optimization)

검색엔진 크롤러는 자바스크립트를 제외한 HTML만 파싱하고 구글의 경우 자바스크립트을 지원하지만 아직 불완전하다고 한다. 그래서 CSR의 경우 SEO에 불리하다.

CSR의 SEO 문제 **해결방법**으로;

- SEO가 필요한 페이지에 SSR나 SSG를 도입
  - 별도의 서버에서 HTML 제공
  - 프레임워크(NextJS, Gatsby 등) 사용

### 3e. 사용용도

|               | CSR | SSR | SSG |
| ------------- | --- | --- | --- |
| SEO 중요      | x   | o   | o   |
| 내용이 바뀐다 | o   | o   | x   |

검색엔진 노출이 중요하면 SSR이나 SSG가 유리하다. 만약, 개인정보가 포함된 페이지라면 검색엔진 노출을 피해야 하기 떄문에 렌더링 방식을 결정하는데 SEO는 고려사항이 아닐 것이다.

SSR은 사용자마다 페이지 내용이 다를 때, SSG는 모두에게 페이지 내용이 같을 때 적합하다.
