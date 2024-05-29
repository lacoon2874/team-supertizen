# 기본 이미지로 Node.js 버전 20.11.1 사용
FROM node:20.11.1 as build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 package-lock.json을 복사하여 종속성 설치
COPY package*.json ./

# 종속성 설치
RUN npm install

# 나머지 애플리케이션 코드 복사
COPY . .

# .env 파일 변경
#COPY .env-dev .env

# 프론트엔드 코드 빌드
RUN npm run build

# NGINX 이미지 생성
FROM nginx:latest

# NGINX에서 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기본 NGINX 정적 콘텐츠 제거
RUN rm -rf ./*

# Node.js 빌드 단계에서 빌드된 프론트엔드 코드 복사
COPY --from=build /usr/src/app/dist/ .

# 추가 NGINX 구성 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# NGINX를 시작
CMD ["nginx", "-g", "daemon off;"]