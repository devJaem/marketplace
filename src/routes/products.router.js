import express from 'express';
import Product from '../schemas/product.schema.js';
import joi from 'joi';
import mongoose from 'mongoose';

const router = express.Router();

const createProductSchema = joi.object({
  name: joi.string().required().messages({
    'string.base': '상품명은 문자열이어야 합니다.',
    'any.required': '상품명을 입력해주세요.',
  }),
  description: joi.string().required().messages({
    'string.base': '상품 설명은 문자열이어야 합니다.',
    'any.required': '상품 설명을 입력해주세요.',
  }),
  manager: joi.string().required().messages({
    'string.base': '담당자는 문자열이어야 합니다.',
    'any.required': '담당자를 입력해주세요.',
  }),
  password: joi.string().required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'any.required': '비밀번호를 입력해주세요.',
  }),
});

const updateProductSchema = joi.object({
  name: joi.string().messages({
    'string.base': '상품명은 문자열이어야 합니다.',
  }),
  description: joi.string().messages({
    'string.base': '상품 설명은 문자열이어야 합니다.',
  }),
  manager: joi.string().messages({
    'string.base': '담당자는 문자열이어야 합니다.',
  }),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT').messages({
    'string.base': '상태는 문자열이어야 합니다.',
    'any.only': '상태는 FOR_SALE 또는 SOLD_OUT 이어야 합니다.',
  }),
  password: joi.string().required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'any.required': '비밀번호를 입력해주세요.',
  }),
});

const deleteProductSchema = joi.object({
  password: joi.string().required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'any.required': '비밀번호를 입력해주세요.',
  }),
});

/* 상품 생성 API */
router.post('/products', async (req, res, next) => {
  try {
    const validation = await createProductSchema.validateAsync(req.body);
    const { name, description, manager, password } = validation;

    const productMaxOrder = await Product.findOne().sort('-order').exec();
    const order = productMaxOrder ? productMaxOrder.order + 1 : 1;

    const status = 'FOR_SALE';
    const createdAt = new Date();
    const updatedAt = new Date();

    const product = new Product({
      order,
      name,
      description,
      manager,
      password,
      status,
      createdAt,
      updatedAt,
    });
    await product.save();

    const { password: _, ...resData } = product.toObject();

    return res.status(201).json({
      status: 201,
      message: '상품 생성에 성공했습니다.',
      data: resData,
    });
  } catch (error) {
    next(error);
  }
});

/* 상품 목록 조회 API */
router.get('/products', async (req, res, next) => {
  const products = await Product.find().sort('-createAt').exec();
  const resData = products.map(
    ({
      order,
      name,
      description,
      manager,
      status,
      createdAt,
      updatedAt,
      _id,
    }) => ({
      id: _id.toString(),
      name,
      order,
      description,
      manager,
      status,
      createdAt,
      updatedAt,
    })
  );

  return res.status(200).json({
    status: 200,
    message: '상품 목록 조회에 성공했습니다.',
    data: resData,
  });
});

/* 상품 상세 조회 API */
router.get('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const { password: _, ...resData } = product.toObject();

    return res.status(200).json({
      status: 200,
      message: '상품 상세 조회에 성공했습니다.',
      data: resData,
    });
  } catch (error) {
    next(error);
  }
});

/* 상품 수정 API */
router.put('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const validation = await updateProductSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = validation;

    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    if (product.password !== password) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (manager) product.manager = manager;
    if (status) product.status = status;
    
    const updatedAt = new Date();
    product.updatedAt = updatedAt;

    await product.save();

    const { password: _, ...resData } = product.toObject();

    return res.status(200).json({
      status: 200,
      message: '상품 수정에 성공했습니다.',
      data: resData,
    });
  } catch (error) {
    next(error);
  }
});

/* 상품 삭제 API */
router.delete('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const validation = await deleteProductSchema.validateAsync(req.body);
    const { password } = validation;

    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('잘못된 id값 입니다.');
      error.status = 404;
      throw error;
    }

    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    if (product.password !== password) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }

    await product.deleteOne();

    return res.status(200).json({
      status: 200,
      message: '상품 삭제에 성공했습니다.',
      data: {
        id: productId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
