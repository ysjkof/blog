---
title: 오라클 클라우드에 NestJS와 PostgreSQL DB 배포하기 4
description: 오라클 리눅스에 NodeJS 환경 설정하고 NestJS 실행하기
categories: [배포]
tags: [오라클 클라우드, 오라클 리눅스, NestJS, NodeJS]
publishedDate: 2022/09/30
lastModifiedAt: 2022/09/30
---

# 오라클 리눅스에 NodeJS 환경 설정하고 NestJS 실행하기

🚨 오라클 리눅스 9를 사용합니다. 버전 8이하와 차이가 있습니다.

## 목차

- [A Node 환경 설정](#a-node-환경-설정)
- [B 환경변수 설정](#b-환경변수-설정)
- [C 프로젝트 설치](#c-프로젝트-설치)
- [D 프로젝트 실행과 접속](#d-프로젝트-실행과-접속)

## A. Node 환경 설정

- NodeJS

```bash
dnf install nodejs
```

- NPM

```bash
dnf install npm
```

node를 설치할 때 같이 설치되지 않아서 따로 설치한다.

- NestJS

```bash
npm i -g @nestjs/cli
```

설치해야 build가 작동합니다.

## B. 환경변수 설정

```ts
// app.module.ts
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			...
		}),
		...
	]
})
```

환경변수에서 DB 정보를 불러와 TypeOrmModule에 적용하고 있기 때문에 환경변수를 설정해야 한다.

**.env**파일을 사용하지 않을때는 **커맨드 쉘**에서 환경변수를 불러온다.

bash일 경우 `~/.bashrc`에서, zsh일 경우 `~/.zshrc`에서 변수를 설정한다.

### .bashrc 수정

텍스트 편집기로 app.module.ts 파일을 연다. 아래 아무 방법이나 사용한다.

- `sudo nano 프로젝트경로/src/app.module.ts`
- `sudo vi 프로젝트경로/src/app.module.ts`
- vscode에서 ssh연결해서 열기

1. `~/.bashrc`에 변수 설정

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=사용자이름
export DB_PASSWORD=비밀번호
export DB_NAME=DB이름
```

한 개의 VM에서 NestJS와 PostgreSQL을 실행하기 때문에 host는 localhost를 쓴다. PostgreSQL에서 따로 설정하지 않았다면 port는 기본값인 5432다. 나머지는 설정한 값을 넣는다.

2. 새로고침

```
source ~/.bashrc
```

3. 커멘드 쉘의 바뀐 환경변수 확인

터미널에서 **node -> process.env**나 **printenv**를 입력

## C. 프로젝트 설치

- github에서 clone해오기 위해 git을 설치한다.

```bash
dnf install git
```

- 프로젝트를 클론하고 빌드한다.

```bash
git clone 프로젝트깃허브url
cd 프로젝트
npm install
npm run build
```

## D. 프로젝트 실행과 접속

### 실행

```bash
node ~/프로젝트/dist/main.js
```

nestjs의 기본 빌드 경로는 dist다. dist의 main.js를 실행하면 서버가 시작된다.

### 접속

오라클 클라우드의 **공용 IP 주소**와 **백엔드port**를 `http://ip주소:포트번호` 형태로 프론트 엔드에 입력하면 백엔드와 연결된다.

| 이름            | 목적                               |
| --------------- | ---------------------------------- |
| 백엔드 포트     | NestJS 서버에 접속하기 위한 포트   |
| PostgreSQL 포트 | PostgreSQL DB에 접속하기 위한 포트 |

DB는 NestJS에서 접속하면 되고 우리의 프론트엔드는 NestJS에만 접속하면 된다.

```ts
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT); // 🚨 여기 포트

  console.log('🚀 Start NestJS Server. Port is', process.env.PORT);
}
bootstrap();
```

app.listen하는 포트가 백엔드 포트고, 이 포트는 방화벽설정에서 열려 있어야 한다.
