---
title: NextJS yarn start 실행했을 때 실행되는 코드 살펴보기
description: NextJS yarn start 실행했을 때 코드들
categories: [NextJS]
tags: [NextJS]
publishedDate: 2022/10/05
lastModifiedAt: 2022/10/05
---

# NextJS yarn start 실행했을 때 실행되는 코드 살펴보기

## 목차

- [A. 소스코드 찾기](#a-소스코드-찾기)
- [B. 코드 살펴보기](#b-코드-살펴보기)
  - [B1. next-start.ts](#b1-next-startts)
  - [B2. start-server.ts](#b2-start-serverts)

## A. 소스코드 찾기

```
~/next-js-app main ❯ yarn start

> next-js-app@0.1.0 start
> next start

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

NextJS App을 시작하면 위와 같은 알림이 나온다. 해당 문자로 소스코드를 찾는다.

[NextJS 소스코드](https://github.com/vercel/next.js)에서 `ready - started server on`를 검색했다.

![NextJS yarn start 실행했을 때 코드들 01](/assets/images/2022-10-05/NextJS%20yarn%20start%20실행했을%20때%20실행되는%20코드%20살펴보기%2001.png)

커맨드 명령어를 입력했을 때 코드니까 `packages/next/cli/next-start.ts`를 살펴보면 될 것 같다.

```ts
startServer({
  dir,
  hostname: host,
  port,
  keepAliveTimeout,
})
  .then(async (app) => {
    const appUrl = `http://${app.hostname}:${app.port}`;
    Log.ready(`started server on ${host}:${app.port}, url: ${appUrl}`);
    await app.prepare();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

yarn start했을 때 나타난 "started server on ~" 메시지가 `startServer`에 있다. 호스트, 포트 등의 형태를 봤을 때 이곳이 맞는 것 같다.

## B. 코드 살펴보기

### B1. next-start.ts

경로: `packages/next/cli/next-start.ts`

```ts
import arg from 'next/dist/compiled/arg/index.js';
import { startServer } from '../server/lib/start-server';
import { getPort, printAndExit } from '../server/lib/utils';
import * as Log from '../build/output/log';
import isError from '../lib/is-error';
import { getProjectDir } from '../lib/get-project-dir';
import { cliCommand } from '../lib/commands';

const nextStart: cliCommand = (argv) => {
  const validArgs: arg.Spec = {
    // Types
    '--help': Boolean,
    '--port': Number,
    '--hostname': String,
    '--keepAliveTimeout': Number,

    // Aliases
    '-h': '--help',
    '-p': '--port',
    '-H': '--hostname',
  };
  let args: arg.Result<arg.Spec>;

  // 입력한 커맨드 명령어가 validArgs에 있는지 확인하고 없는 명령어라면 에러를 출력한다.
  try {
    args = arg(validArgs, { argv });
  } catch (error) {
    if (isError(error) && error.code === 'ARG_UNKNOWN_OPTION') {
      return printAndExit(error.message, 1);
    }
    throw error;
  }

  // CLI에서 --help를 붙이면 도움말 출력하고 프로세스 종료
  if (args['--help']) {
    console.log(`
      Description
        Starts the application in production mode.
        The application should be compiled with \`next build\` first.

      Usage
        $ next start <dir> -p <port>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
        --keepAliveTimeout  Max milliseconds to wait before closing inactive connections
        --help, -h      Displays this message
    `);
    process.exit(0);
  }

  // CLI 입력에 따라 값들을 설정
  const dir = getProjectDir(args._[0]);
  const host = args['--hostname'] || '0.0.0.0';
  const port = getPort(args);

  const keepAliveTimeoutArg: number | undefined = args['--keepAliveTimeout'];
  if (
    typeof keepAliveTimeoutArg !== 'undefined' &&
    (Number.isNaN(keepAliveTimeoutArg) ||
      !Number.isFinite(keepAliveTimeoutArg) ||
      keepAliveTimeoutArg < 0)
  ) {
    printAndExit(
      `Invalid --keepAliveTimeout, expected a non negative number but received "${keepAliveTimeoutArg}"`,
      1
    );
  }

  const keepAliveTimeout = keepAliveTimeoutArg
    ? Math.ceil(keepAliveTimeoutArg)
    : undefined;

  // 설정한 값에 따라 서버 실행
  startServer({
    dir,
    hostname: host,
    port,
    keepAliveTimeout,
  })
    .then(async (app) => {
      const appUrl = `http://${app.hostname}:${app.port}`;
      Log.ready(`started server on ${host}:${app.port}, url: ${appUrl}`);
      await app.prepare();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

export { nextStart };
```

### B2. start-server.ts

next-start.ts에서 한 설정을 받고 서버를 시작한다.

경로: `packages/next/server/lib/start-server.ts`

```ts
import type { NextServerOptions, NextServer, RequestHandler } from '../next';
import { warn } from '../../build/output/log';
import http from 'http';
import next from '../next';

interface StartServerOptions extends NextServerOptions {
  allowRetry?: boolean;
  keepAliveTimeout?: number;
}

export function startServer(opts: StartServerOptions) {
  let requestHandler: RequestHandler;

  // 서버 만듦
  const server = http.createServer((req, res) => {
    return requestHandler(req, res);
  });

  // keepAliveTimeout인수가 있을 경우 서버에 설정
  if (opts.keepAliveTimeout) {
    server.keepAliveTimeout = opts.keepAliveTimeout;
  }

  // 비동기로 서버를 반환
  return new Promise<NextServer>((resolve, reject) => {
    let port = opts.port;
    let retryCount = 0;

    // Listen to the error request event
    server.on('error', (err: NodeJS.ErrnoException) => {
      // 포트를 바꾸면서 서버 시작을 10번 시도하고 실패하면 프로미스 에러 반환
      if (
        port &&
        opts.allowRetry &&
        err.code === 'EADDRINUSE' &&
        retryCount < 10
      ) {
        warn(`Port ${port} is in use, trying ${port + 1} instead.`);
        port += 1;
        retryCount += 1;
        server.listen(port, opts.hostname);
      } else {
        reject(err);
      }
    });

    let upgradeHandler: any;

    // dev가 아니면 upgradeHandler를 실행
    if (!opts.dev) {
      // Listen to the upgrade request event
      server.on('upgrade', (req, socket, upgrade) => {
        upgradeHandler(req, socket, upgrade);
      });
    }

    // Listen to the listening request event
    server.on('listening', () => {
      const addr = server.address();
      const hostname =
        !opts.hostname || opts.hostname === '0.0.0.0'
          ? 'localhost'
          : opts.hostname;

      const app = next({
        ...opts,
        hostname,
        customServer: false,
        httpServer: server,
        port: addr && typeof addr === 'object' ? addr.port : port,
      });

      requestHandler = app.getRequestHandler();
      upgradeHandler = app.getUpgradeHandler();
      // 문제없이 왔다면 여기서 next app을 반환
      resolve(app);
    });

    // 서버 연결 수신 시작
    server.listen(port, opts.hostname);
  });
}
```
