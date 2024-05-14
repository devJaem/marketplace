import express from 'express';
import Product from '../schemas/product.schema.js';
import joi from 'joi';
import mongoose from 'mongoose';

const router = express.Router();

const createProductSchema = joi.object({
  name: joi.string().min(1).max(50).required().messages({
    'string.base': '상품명은 문자열이어야 합니다.',
    'string.min': '상품명은 최소 {#limit}자 이상이어야 합니다.',
    'string.max': '상품명은 최대 {#limit}자 이하이어야 합니다.',
    'any.required': '상품명을 입력해주세요.'
  }),
  description: joi.string().min(1).max(50).required().messages({
    'string.base': '상품 설명은 문자열이어야 합니다.',
    'string.min': '상품 설명은 최소 {#limit}자 이상이어야 합니다.',
    'string.max': '상품 설명은 최대 {#limit}자 이하이어야 합니다.',
    'any.required': '상품 설명을 입력해주세요.'
  }),
  manager: joi.string().min(1).max(50).required().messages({
    'string.base': '담당자는 문자열이어야 합니다.',
    'string.min': '담당자는 최소 {#limit}자 이상이어야 합니다.',
    'string.max': '담당자는 최대 {#limit}자 이하이어야 합니다.',
    'any.required': '담당자를 입력해주세요.'
  }),
  password: joi.string().min(1).max(50).required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'string.min': '비밀번호는 최소 {#limit}자 이상이어야 합니다.',
    'string.max': '비밀번호는 최대 {#limit}자 이하이어야 합니다.',
    'any.required': '비밀번호를 입력해주세요.'
  })
});

router.post('/products', async (req, res, next) => {
  try{
    const validation = await createProductSchema.validateAsync(req.body);
    const {name, description, manager, password} = validation;

    const productMaxOrder = await Product.findOne().sort('-order').exec();
    const order = productMaxOrder ? productMaxOrder.order + 1 : 1;

    const status = "FOR_SALE";
    const createdAt = new Date();
    const updatedAt = new Date();

    const product = new Product({order, name, description, manager, password, status, createdAt, updatedAt});
    await product.save();

    const { password: _, ...resData } = product.toObject();
    
    return res.status(201).json({
      status: 201,
      message: '상품 생성에 성공했습니다.',
      data: resData
    })

  }catch(error){
    next(error);

  }
});

/* 상품 목록 조회 API */
router.get('/products', async (req, res, next) => {
  const products = await Product.find().sort('-order').exec();
  const resData = products.map(({ order, name, description, manager, status, createdAt, updatedAt, _id}) => ({
    id: _id.toString(),
      name,
      order,
      description,
      manager,
      status,
      createdAt,
      updatedAt
  }));

  return res.status(200).json({
    status: 200,
    message: '상품 목록 조회에 성공했습니다.',
    data: resData
  });
});

/* 상품 상세 조회 API */
router.get('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;
  try{
    if(!mongoose.isValidObjectId(productId)){
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    
    const product = await Product.findById(productId).exec();
    if (!product){
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    
    const { password: _, ...resData } = product.toObject();

    return res.status(200).json({
      status: 200,
      message: "상품 상세 조회에 성공했습니다.",
      data: resData
    });
  }catch(error){
    next(error);
  }
});

export default router;