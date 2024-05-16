### product.service.js
---
```javascript
import mongoose from 'mongoose';
import Product from '../schemas/product.schema.js';

// 몽고디비 Id값 유효성 로직
const validateProductId = (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error('상품이 존재하지 않습니다.');
    error.status = 404;
    throw error;
  }
};

// 상품을 찾을수 없을떄, 오류처리
const findProductById = async (productId) => {
  const product = await Product.findById(productId).exec();
  if (!product) {
    const error = new Error('상품이 존재하지 않습니다.');
    error.status = 404;
    throw error;
  }
  return product;
};

// 입력 비밀번호가 다를때 오류 처리
const verifyPassword = (product, password) => {
  if (product.password !== password) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }
};

// 중복된 상품명이 있을때 처리
const checkDuplicateProductName = async (name) => {
  const existingProduct = await Product.findOne({ name }).exec();
  if (existingProduct) {
    const error = new Error('이미 등록된 상품입니다.');
    error.status = 409;
    throw error;
  }
}

export default {validateProductId, findProductById, verifyPassword, checkDuplicateProductName};
```