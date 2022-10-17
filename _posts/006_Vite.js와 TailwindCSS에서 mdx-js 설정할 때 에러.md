---
title: Vite.js와 TailwindCSS에서 mdx-js 설정할 때 에러
description: Vite.js로 생성한 react 환경에서 TailwindCSS를 사용하는 경우, mdx-js를 설정하려면 package.json에 type설정을 주고 postcss.config.js와 tailwind.config.js파일 확장자를 .cjs로 바꾼다
categories: [문제 해결]
tags: [mdx-js, Vite.js, TailwindCSS]
publishedDate: 2022/09/12
lastModifiedAt: 2022/09/12
---

# Vite.js와 TailwindCSS에서 mdx-js 설정할 때 에러

## 도전

### 기본 설정

아래처럼 했다.

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

export default defineConfig({
  plugins: [react(), visualizer(), mdx()],
});
```

아래는 발생한 에러

````bash
failed to load config from /Users/iseongjin/gh/muool-frontend/vite.config.ts
error when starting dev server:
Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/iseongjin/gh/muool-frontend/node_modules/@mdx-js/rollup/index.js from /Users/iseongjin/gh/muool-frontend/vite.config.ts not supported.
Instead change the require of index.js in /Users/iseongjin/gh/muool-frontend/vite.config.ts to a dynamic import() which is available in all CommonJS modules.
    at Object._require.extensions.<computed> [as .js] (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:62910:17)
    at Object.<anonymous> (/Users/iseongjin/gh/muool-frontend/vite.config.ts:32:29)
    at Object._require.extensions.<computed> [as .js] (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:62907:24)
    at loadConfigFromBundledFile (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:62915:21)
    at loadConfigFromFile (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:62780:34)
    at async resolveConfig (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:62398:28)
    at async createServer (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:59018:20)
    at async CAC.<anonymous> (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/cli.js:699:24)
    ```
````

### 에러1 해결

package.json에 `"type": "module"` 추가해서 해결했다.

```json
// package.json
  "type": "module"
```

해당 문제가 해결되니 아래 에러가 발생했다.

```bash
오후 8:30:01 [vite] Internal server error: Failed to load PostCSS config (searchPath: /Users/iseongjin/gh/muool-frontend): [Failed to load PostCSS config] Failed to load PostCSS config (searchPath: /Users/iseongjin/gh/muool-frontend): [ReferenceError] module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/iseongjin/gh/muool-frontend/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/iseongjin/gh/muool-frontend/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///Users/iseongjin/gh/muool-frontend/postcss.config.js:1:1
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:533:24)
    at async importDefault (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:25930:18)
    at async Object.search (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:18367:38)
    at async resolvePostcssConfig (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:42395:22)
    at async compileCSS (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:42163:27)
    at async TransformContext.transform (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:41786:55)
    at async Object.transform (file:///Users/iseongjin/gh/muool-frontend/node_modules/vite/dist/node/chunks/dep-71eb12cb.js:35284:30)

  Plugin: vite:css
  File: /Users/iseongjin/gh/muool-frontend/src/styles/tailwind.css (x2)
```

### 에러2 해결

에러메시지가 `.js`를 `.cjs`로 바꾸라고 해결방법을 제시 해주고 있다.

문제가 발생한 `postcss.config.js`를 `postcss.config.cjs`로 `tailwind.config.js`를 `tailwind.config.cjs`로 바꿨다.

잘 작동한다
