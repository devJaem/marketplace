import mongoose from 'mongoose';
import Product from '../schemas/product.schema.js';

const validateProductId = (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error('상품이 존재하지 않습니다.');
    error.status = 404;
    throw error;
  }
};

const findProductById = async (productId) => {
  const product = await Product.findById(productId).exec();
  if (!product) {
    const error = new Error('상품이 존재하지 않습니다.');
    error.status = 404;
    throw error;
  }
  return product;
};

const verifyPassword = (product, password) => {
  if (product.password !== password) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }
};

const checkDuplicateProductName = async (name) => {
  const existingProduct = await Product.findOne({ name }).exec();
  if (existingProduct) {
    const error = new Error('이미 등록된 상품입니다.');
    error.status = 409;
    throw error;
  }
};

export default {
  validateProductId,
  findProductById,
  verifyPassword,
  checkDuplicateProductName,
};
