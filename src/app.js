import express from 'express';
import connect from './schemas/index.js';
import dotenv from 'dotenv'
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import productsRouter from './routes/products.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: '서버 동작중...' });
});

app.use('/api/v1', [router, productsRouter]);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, 'marketPlace BE OPEN!');
});