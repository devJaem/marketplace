# 내배캠 NodeJS_5기 정재민
### 나만의 내배캠 장터 백엔드 서버 만들기
---
#### Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/marketplace.git .
```
2. Node 의존성 다운로드
```bash
yarn install
```

3. .env 파일 생성하기
```bash
# .env
PORT= 포트번호
MONGODB_URL="아틀라스 페이지에서 가저온 uri"
MONGODB_NAME="DB 이름"
```

4. 서버 실행하기
```bash
# nodemon 으로 실행하기
yarn run dev
```

#### 폴더구조
```
.
├── node_modules
├── src
│   ├── middlewarmies
│   │   └── error-handler.middleware.js
│   ├── routers
│   │   └── products.router.js
│   ├──  schemas
│   │    ├── index.js
│   │    └── product.schema.js
│   └── app.js
├── .env
├── .gitignore
├── .prettierrc
├── package.json
├── README.md
└── yarn.lock
```

- `app.js`
    - **전체 어플리케이션의 시작점**입니다.
    - **미들웨어(Middleware)**와 **라우터(Router)**를 등록하며, 서버를 시작하는 역할을 담당합니다.
- **middlewares**
    - 미들웨어를 정의하기 위해 사용합니다.
    - 에러 핸들러, 로깅, 사용자 인증과 같은 미들웨어를 이 폴더에서 관리합니다.
- **routes**
    - Express.js의 **라우터(Router)**를 관리하기 위해 사용합니다.
    - 각 **API 경로를 정의**하며, 해당 경로에서 실행될 **함수를 관리**하는 역할을 담당합니다.
- **schemas**
    - MongoDB를 사용하기 위한 `mongoose`의 **스키마(Schema)** 및 **모델(Model)**을 정의하기 위해 사용합니다.
    - MongoDB **데이터의 구조**와 **데이터를 처리할 메서드**를 정의하는 역할을 담당합니다.

