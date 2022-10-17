---
title: 오라클 클라우드에 NestJS와 PostgreSQL DB 배포하기 3
description: 오라클 리눅스에 PostgreSQL 설치, 접속
categories: [배포]
tags: [오라클 클라우드, 오라클 리눅스, PostgreSQL, Database]
publishedDate: 2022/09/30
lastModifiedAt: 2022/09/30
---

# 오라클 리눅스에 PostgreSQL 설치, 접속

🚨 오라클 리눅스 9를 사용합니다. 버전 8이하와 차이가 있습니다.

## 목차

- [A 설치](#a-설치)
- [B 설정](#b-설정)
  - [B0 방화벽 설정](#b0-방화벽-설정)
  - [B1 DB 시작](#b1-db-시작)
  - [B2 DB 설정](#b2-db-설정)
    - [B2-1 postgresql.conf](#b2-1-postgresqlconf)
    - [B2-2 pg_hba.conf](#b2-2-pg_hbaconf)
  - [B3 DB 및 계정 만들기](#b3-db-및-계정-만들기)
- [C 접속](#c-접속)
  - [C1 외부접속](#c1-외부접속)
  - [C2 내부접속](#c2-내부접속)
- [참조](#참조)

## A. 설치

오라클 리눅스에서 사용가능한 PostgreSQL 버전에 제한이 있으니 시작하기 전에 확인해야 된다.

- postgresql

```bash
sudo dnf install postgresql
```

- postgresql-server

```bash
sudo dnf install postgresql-server
```

## B. 설정

### B0. 방화벽 설정

외부에서 DB에 접속하려면 방화벽을 열어야 합니다.

[[2 오라클 리눅스 설정]]에서 방화벽 설정을 참고하세요.

### B1. DB 시작

초기화, 시작, 활성화를 실행한다.

#### 초기화

```bash
sudo postgresql-setup --initdb
```

#### 설정 삭제

- 만약 문제가 있다면 data 삭제를 하고 여기부터 다시 시작한다.

```bash
sudo rm -rf /var/lib/pgsql/data
```

#### 시작

```bash
sudo systemctl start postgresql
```

#### 재시작

```bash
sudo systemctl restart postgresql
```

#### 활성화

```bash
sudo systemctl enable postgresql
```

#### 상태확인

```bash
sudo systemctl status postgresql
```

- 출력

```bash
● postgresql.service - PostgreSQL database server
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; vendor preset: disabled)
     Active: active (running) since Mon 2022-09-26 18:51:11 KST; 7min ago
   Main PID: 40084 (postmaster)
      Tasks: 8 (limit: 150140)
     Memory: 17.7M
        CPU: 127ms
     CGroup: /system.slice/postgresql.service
             ├─40084 /usr/bin/postmaster -D /var/lib/pgsql/data
             ├─40085 "postgres: logger "
             ├─40087 "postgres: checkpointer "
             ├─40088 "postgres: background writer "
             ├─40089 "postgres: walwriter "
             ├─40090 "postgres: autovacuum launcher "
             ├─40091 "postgres: stats collector "
             └─40092 "postgres: logical replication launcher "

Sep 26 18:51:11 instance systemd[1]: Starting PostgreSQL database server...
Sep 26 18:51:11 instance postmaster[40084]: 2022-09-26 18:51:11.208 KST [40084] LOG:  redirecting log output to logging collector process
Sep 26 18:51:11 instance postmaster[40084]: 2022-09-26 18:51:11.208 KST [40084] HINT:  Future log output will appear in directory "log".
Sep 26 18:51:11 instance systemd[1]: Started PostgreSQL database server.
```

#### PostgreSQL의 포트 확인

- 기본 포트 : 5432

```bash
ss -antpl | grep 5432
```

- 출력

```bash
LISTEN 0      244             127.0.0.1:5432       0.0.0.0:*
LISTEN 0      244                 [::1]:5432          [::]:*
```

### B2. DB 설정

#### B2-1. postgresql.conf

postgresql.conf를 텍스트 편집기로 엽니다.

```bash
sudo nano /var/lib/pgsql/data/postgresql.conf
```

##### 모든 IP접속 대기하기

PostgreSQL 서버가 어떤 IP에서도 접속을 대기할 수 있도록 합니다.
**listen_addresses** 를 찾아 아래처럼 바꾸고 저장합니다.

```
listen_addresses = '*'
```

#### B2-2. pg_hba.conf

postgresql.conf를 텍스트 편집기로 엽니다.

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

##### 접속 허용 IP 등록

아래 같은 형식으로 IP를 추가합니다. 접속할 컴퓨터(프론트엔드 서버)의 IP를 입력합니다.

```
host all all xxx.xxx.xxx.xxx/32 md5
```

![PostgreSQL 설치, 접속_01](/assets/images/2022-09-30/PostgreSQL%20설치,%20접속_01.png)

### B3. DB 및 계정 만들기

#### B3-1. 기본 계정 비밀번호 설정

- PostgreSQL에 사용자 postgres로 로그인

```bash
sudo su - postgres
```

- postgres에 비밀번호 설정

```bash
psql -c "alter user postgres with password 'securepassword'"
```

- 나가기

```bash
exit
```

#### B3-2. DB, 사용자 계정 생성

- 다음 커맨드로 PostgreSQL shell에 로그인 후 진행한다.

```bash
sudo -u postgres psql
```

- DB 생성

```bash
create database 이름;
```

- 사용자 계정 생성

```bash
create user 이름 with password '비밀번호';
```

- 인코딩/트랜잭션 처리방법 설정

```bash
alter role 사용자이름 set client_encoding to 'utf8';
alter role 사용자이름 set default_transaction_isolation to 'read committed';
```

- 사용자에게 DB의 모든 사용권한 부여

```bash
grant all privileges on database DB이름 to 사용자이름;
```

#### B3-3. 명령어

- 사용자 목록

```bash
\du
```

- db 목록

```bash
\l
```

- db 지우기

```bash
DROP DATABASE db이름
```

- 사용자 지우기

```bash
DROP USER 사용자이름
```

## C. 접속

### C1. 외부접속

postico를 사용해 외부 접속합니다.

![PostgreSQL 설치, 접속_02](/assets/images/2022-09-30/PostgreSQL%20설치,%20접속_02.png)

| 항목     | 내용                                  |
| -------- | ------------------------------------- |
| Host     | 오라클 클라우드 인스턴스 공용 IP 주소 |
| Port     | DB 포트(기본 5432)                    |
| Database | DB이름                                |
| User     | 사용자 계정 이름                      |
| Password | 사용자 계정 비밀번호                  |

### C2. 내부접속

오라클 리눅스 내부에서 로컬호스트로 접속하려면 Host만 localhost로 바꾸면 된다.

---

## 참조

- 오라클 리눅스8에 PostgreSQL 서버 설치 : https://www.atlantic.net/dedicated-server-hosting/how-to-install-and-secure-postgresql-server-on-oracle-linux-8/
- 오라클 리눅스8에 PostgreSQL 외부접속 설정 : https://technfin.tistory.com/entry/오라클-리눅스-8-PostgreSQL-13-외부-접속하기?category=867919#방화벽_개방하기
- PostgreSQL CRUD 명령어 : https://ssunws.tistory.com/20
