import express from 'express';
import Product from '../schemas/product.schema.js';
import productValidation from '../schemas/product.validation.js';
import productService from '../schemas/product.service.js';

const { createProductSchema, updateProductSchema, deleteProductSchema } =
  productValidation;
const {
  validateProductId,
  findProductById,
  verifyPassword,
  checkDuplicateProductName,
} = productService;

const router = express.Router();

/* 상품 생성 API */
router.post('/products', async (req, res, next) => {
  try {
    const validation = await createProductSchema.validateAsync(req.body);
    const { name, description, manager, password } = validation;

    await checkDuplicateProductName(name);

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
  const products = await Product.find().sort('-createdAt').exec();
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
    validateProductId(productId);

    const product = await findProductById(productId);

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
router.patch('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const validation = await updateProductSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = validation;

    validateProductId(productId);

    const product = await findProductById(productId);

    if (name && name !== product.name) {
      await checkDuplicateProductName(name, productId);
    }

    verifyPassword(product, password);

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

    validateProductId(productId);

    const product = await findProductById(productId);

    verifyPassword(product, password);

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
