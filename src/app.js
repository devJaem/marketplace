import express from 'express';
import connect from './schemas/index.js';
import dotenv from 'dotenv'
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
// import productsRouter from './routes/products.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

console.log('PORT:', PORT); // 환경 변수 로드 확인을 위한 로그
console.log('MONGODB_URL:', process.env.MONGODB_URL);
console.log('MONGODB_NAME:', process.env.MONGODB_NAME);

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

// const router = express.Router();

// router.get('/', (req, res) => {
  // return res.json({ message: 'Hi!' });
// });

// app.use('/api/v1', [router, productsRouter]);
// app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, 'marketPlace BE OPEN!');
});