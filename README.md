## 프로젝트 설명
성인 유해 컨텐츠 판별 Web Application입니다.  
사용자가 입력한 동영상의 프레임을 추출하여 ai를 이용해 유해한 컨텐츠인지 아닌지를 판별합니다.

### 사용 기술
이 프로젝트는 MVC 패턴 구조를 따르고 있습니다. Model과 Controller는 backend로 처리했고, View는 frontend로 처리했습니다.
View는 React.js 라이브러리를 통해 제작되며, Web apllication API는 Flask 프레임워크를 사용합니다. 
배포에는 Web server로 Niginx를, Web application server로는 gunicorn을 사용합니다. 실제 구동 시 AWS를 통해 실행됩니다.  
또한 DB 쿼리를 비동기 처리 하기 위해 RabbitMQ와 Celery를 부가적으로 사용합니다. 
Database로는 gcp의 PostgreSQL instance를 사용하고 SQLAlchemy로 Flask와 연동합니다. 그리고 DB Migration을 위해 alembic을 사용합니다.  

- React.js
- Flask
- RabbitMQ
- Celery
- GCP PostgreSQL + SQLAlchemy
- AWS

### design doc
https://www.notion.so/Design-Doc-_-0120-8ac2c8e842a8429fb169b21372554dd1

### AI Model
CNN(Convolutional Neural Network)

## Getting Started
```sh
git clone https://github.com/2021-Sillicon-Valley-Internship-TeamG/Adult_Contents_Detector.git
npm install                                           # 의존성 파일 설치

# Then:
cd flask_server/
export GOOGLE_APPLICATION_CREDENTIALS="my-key.json"   # for GCS upload key
celery -A app.celery worker --loglevel=info           # for rabbitMQ
FLASK_APP = swagger.py flask run -h 0.0.0.0 -p 9991   # for swagger (0.0.0.0:9991)
flask run
cd ../
npm run start
```

### Swagger
<img width="550px" height="300px" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVoAuD%2FbtqUf0TF603%2FuPaEWbmyRicseGoNRLtpsk%2Fimg.png"></img>

### RabbitMQ
<img width="550px" height="300px" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FupCAF%2FbtqUhzVOUBF%2F78efHoKKCXevEf8WgrAdNK%2Fimg.png"></img>

## Directory Structure
```bash
├── README.md                 - 리드미 파일
│
│
├─── backend/             - 백엔드 플라스크 디렉토리
│   ├── app.py                - 서버 시작, 서버 api reply 처리, Front와 소통을 통해 기능을 호출하고 처리하는 역할
│   ├── config.ini             - GCP에 있는 postgreSQL와 연결하기 위한 key가 존재하는 파일
│   ├── flask_celery.py       - celery 생성 파일
│   ├── task.py                - queue 적재 task 생성 파일
│   ├── models.py             - postgreSQL 디비 모델 파일
│   ├── swagger.py            - swagger 실행 파일
│   ├── views.py               - SQLAlchamy의 기능을 정의한 파일
│   ├── (my-key.json)         - GCP에 접속하기 위한 key 파일, 보안 상 이유로 git에는 제공하지 않음
│   ├── requirements.txt     - app.py를 구동하기위한 모듈들을 정리한 파일
│   │
│   ├── data/                 - 백엔드 동영상, 이미지 임시 저장 디렉토리
│   │  └── .keep            - data root, data 폴더를 유지하기 위한 dummy file
│   │ 
│   ├── function/            - api + ai 등 기능적 파일 디렉토리
│   │  ├── ffmpeg.py          - 동영상을 가져와 Frame을 추출하는 기능, ffmpeg 프로그램과 연동
│   │  │
│   │  ├── gcp_control.py    - Video와 Frame이 저장된 GCP Storage에 업로드,다운로드 및 접근 처리 
│   │  │
│   │  └── kakao_api.py       - kakao vision api, 해당 Frame을 가져와 유해성 유무를 판별하는 기능
│   │      
│   │ 
│   └── migrations/               - DB 마이그레이션 SQLAlchemy 기반 툴 alembic 디렉토리
│      │
│      ├── version/    - 해당 alembic 기능 디렉토리
│      │  └── b7218a3671db_.py - alembic 마이그레이션 기능 파일
│      │
│      ├── alembic.ini    - alembic 설정 파일
│      │
│      ├── env.py    - alembic 환경 설정
│      │
│      └──script.py.mako
│
├── frontend/
│   │	    
│   ├── public/                - 리액트 디폴드 디렉토리
│   │    
│   ├── src/                      
│   │	└── components/           - rendering 할 제작 컴포넌트 디렉토리
│   │	   │  │
│   │	   │  ├ css /    - 컴포넌트들의 css
│   │	   │  │
│   │	   │  ├── Home.js          - Home 화면, 시작화면 
│   │	   │  ├── Hor_bar_chart.js          - result 화면에서 Frame 등급 비율을 나타내는 차트
│   │	   │  ├── Detect.js          - detect 화면, 입력 파일과 url 처리
│   │	   │  ├── ProgressBar.js          - Detect 과정에서 걸리는 로딩을 시각화
│   │	   │  └── Result.js          - result 화면
│   │	   │
│   │    ├── App.js & App.css
│   │	   │
│   │	   ├── index.js & index.css
│   │	   │
│   │	   └── images/               - static 이미지 디렉토리 (ex. logo)
│   │
│   └──  package.json & package.lock.json
│      
└── .gitignore		
```  
