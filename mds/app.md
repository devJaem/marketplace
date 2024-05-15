```javascript
import express from 'express';
import connect from './schemas/index.js';
import dotenv from 'dotenv';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import productsRouter from './routes/products.router.js';

//.env 파일을 읽어옴
dotenv.config();

// Express 실행, port번호를 env에서 가지고 옴
const app = express();
const PORT = process.env.PORT;

//Db 연결
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 수행시마다 로그 발생시키기
// 나중에 파일로 만들어 볼 예정
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

// 라우터 사용
const router = express.Router();

// 서버 동작이 정상인지 확인해 보기 위해 지정해봄
router.get('/', (req, res) => {
  return res.json({ message: '서버 동작중...' });
});

// 직접 작성한 상품라우터를 연결
app.use('/api/v1', [router, productsRouter]);
// next() 로 접근할수있는 에러처리 미들웨어
app.use(errorHandlerMiddleware);

// 서버 실행시 콘솔메시지
app.listen(PORT, () => {
  console.log(PORT, 'marketPlace BE OPEN!');
});

```