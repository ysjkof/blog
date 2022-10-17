---
title: 오라클 클라우드에 NestJS와 PostgreSQL DB 배포하기 2
description: 오라클 리눅스의 OS시간대와 방화벽 설정하는 방법
categories: [배포]
tags: [오라클 클라우드, 오라클 리눅스]
publishedDate: 2022/09/30
lastModifiedAt: 2022/09/30
---

# 오라클 리눅스 설정

## 목차

- [A. OS 시간대 설정](#a-os-시간대-설정)
- [B. 방화벽 설정](#b-방화벽-설정)
  - [B1. 오라클 클라우드 방화벽 설정](#b1-오라클-클라우드-방화벽-설정)
  - [B2. 오라클 리눅스 방화벽 설정](#b2-오라클-리눅스-방화벽-설정)
- [참조](#참조)

## A. OS 시간대 설정

- 설정된 시간대 확인

```
[opc@instance ~]$ timedatectl
               Local time: Mon 2022-09-26 03:55:22 GMT
           Universal time: Mon 2022-09-26 03:55:22 UTC
                 RTC time: Mon 2022-09-26 03:55:23
                Time zone: GMT (GMT, +0000)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

- 설정 가능한 타임존 확인

```
[opc@instance ~]$ timedatectl list-timezones | grep Seoul
Asia/Seoul
```

- 시간대 설정

```
[opc@instance ~]$ sudo timedatectl set-timezone Asia/Seoul
```

- 설정된 시간대 확인

```
[opc@instance ~]$ timedatectl
               Local time: Mon 2022-09-26 12:58:24 KST
           Universal time: Mon 2022-09-26 03:58:24 UTC
                 RTC time: Mon 2022-09-26 03:58:25
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

- 설정된 시간대 확인2

```
[opc@instance ~]$ date
Mon Sep 26 12:58:33 KST 2022
```

- 타임존이 변경되었다면 아래와 같이 crontab데몬과 sshd을 재시작

```
[opc@instance ~]$ sudo systemctl restart crond
[opc@instance ~]$ sudo systemctl restart sshd
```

### 에러

- Failed to set locale, defaulting to C.UTF-8 [참조](https://unixcop.com/fix-problem-failed-to-set-locale-defaulting-to-c-utf-8-in-centos-8-rhel-8/)

```bash
dnf install -y glibc-all-langpacks langpacks-en
```

## B. 방화벽 설정

오라클 클라우드와 오라클 리눅스, 방화벽 설정을 2곳에서 동일하게 해야 합니다.

### B1. 오라클 클라우드 방화벽 설정

![인스턴스 생성하고 콘솔 접속하기_01](/assets/images/2022-09-30/인스턴스%20생성하고%20콘솔%20접속하기_01.png)

- 로그인 후 화면에서 주황색 표시한 햄버거 버튼 클릭

![오라클 리눅스 설정_방화벽_웹_01](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_웹_01.png)

- 네트워킹 -> 가상 클라우드 네트워크

![오라클 리눅스 설정_방화벽_웹_02](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_웹_02.png)

- VCN 이름 클릭

![오라클 리눅스 설정_방화벽_웹_03](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_웹_03.png)

- 서브넷 이름 클릭

![오라클 리눅스 설정_방화벽_웹_04](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_웹_04.png)

- 보안 이름 클릭

![오라클 리눅스 설정_방화벽_웹_05](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_웹_05.png)

- 수신 규칙 추가

아래를 참고해 소스 CIDR과 대상 포트 범위를 입력한다.

| 소스 CIDR      | 포트 | 설명                            |
| -------------- | ---- | ------------------------------- |
| 0.0.0.0/0      | 80   | 모든 IP의 80번 포트 허용        |
| 12.12.12.12/32 | 80   | 12.12.12.12 IP의 80번 포트 허용 |
| 12.12.12.12/32 | 80   | C 클래스 대역대 80번 포트 허용  |

### B2. 오라클 리눅스 방화벽 설정

- 80번 포트 개방

```bash
sudo firewall-cmd --permanent --zone=public --add-port=80/tcp
```

- 방화벽 설정을 다시 로드(해야 적용됨)

```bash
sudo firewall-cmd --reload
```

![오라클 리눅스 설정_방화벽_os_01](/assets/images/2022-09-30/오라클%20리눅스%20설정_방화벽_os_01.png)

- 방화벽 설정 상태 보기

```bash
sudo firewall-cmd --list-all
```

- 80번 포트 개방 제거

```bash
sudo firewall-cmd --permanent --remove-port=80/tcp
```

- 특정 IP의 특정 포트에 접근 허용

```bash
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address=12.12.12.12 port port="80" protocol="tcp" accept'
```

---

## 참조

- https://hoing.io/archives/304
- https://hoing.io/archives/369
