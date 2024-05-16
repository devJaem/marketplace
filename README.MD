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

### 폴더구조
---
```
.
├── node_modules
├── MDS
│   ├── app.md
│   ├── error-handler.middleware.md
│   ├── product.router.md
│   └── product.schema.md
├── src
│   ├── middlewarmies
│   │   └── error-handler.middleware.js 미들웨어
│   ├── routers
│   │   └── products.router.js 라우터
│   ├──  schemas
│   │    ├── index.js 디비 연결 정보
│   │    └── product.schema.js 스키마
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
    [app.js 설명](https://github.com/devJaem/marketplace/blob/main/mds/app.md)
- `middlewares`
    - 미들웨어를 정의하기 위해 사용합니다.
    - 에러 핸들러, 로깅, 사용자 인증과 같은 미들웨어를 이 폴더에서 관리합니다.
    [error-handler.middleware.js 설명](https://github.com/devJaem/marketplace/blob/main/mds/error-handler.middleware.md)
- `routes`
    - Express.js의 **라우터(Router)**를 관리하기 위해 사용합니다.
    - 각 **API 경로를 정의**하며, 해당 경로에서 실행될 **함수를 관리**하는 역할을 담당합니다.
    [products.router.js 설명](https://github.com/devJaem/marketplace/blob/main/mds/product.router.md)
- `schemas`
    - MongoDB를 사용하기 위한 `mongoose`의 **스키마(Schema)** 및 **모델(Model)**을 정의하기 위해 사용합니다.
    - MongoDB **데이터의 구조**와 **데이터를 처리할 메서드**를 정의하는 역할을 담당합니다.
    [product.schema.js 설명](https://github.com/devJaem/marketplace/blob/main/mds/product.schema.md)

### 함께 제출할 문제
---
1. **API 명세서**를 작성해야 되는 이유는 무엇인가요?
2. 패키지 설치 시 **package.json** 파일의 **dependencies**에 추가되는 것과 **devDependencies**에 추가되는 것의 차이점은 무엇인가요? 
3. MongoDB의 **Schema**는 무엇인가요? 그리고 **Model**은 또 무엇인가요?
4. 대표적인 **Http Method**는 무엇이며, 각각은 언제 사용하나요?
5. 수정할 때 사용할 수 있는 **HTTP Method**는 **PUT**과 **PATCH**가 있는데, 어떤 차이점이 있나요?
6. 대표적인 **Http Status Code**는 무엇이며, 각각은 언제 사용하나요?
7. API 호출 시 **데이터를 넘기는 방식 3가지**는 무엇이며, 각각은 언제 사용하나요?
8. API 설계 시 **RESTful**하게 설계한다는 것은 무엇인가요?
9. **비밀번호 저장 시 평문으로 저장**하면 DB 유출 시 문제가 됩니다. 어떻게 저장해야 안전하게 저장할 수 있을까요?
10. **미들웨어**를 사용하는 이유와 에러 처리 이 외에 어떤 용도로 사용할 수 있을까요?