# 베이스 이미지 설정
FROM python:3.11.7

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY . /app

# 필요한 라이브러리 설치
RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt

# opencv 사전준비
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# 데이터베이스 마이그레이션
RUN python manage.py makemigrations
RUN python manage.py migrate

# 서버 실행
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]