### product.router.js
---
```javascript
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
  try{
    //Body에 입력한 json 값을 유효성검증
    const validation = await createProductSchema.validateAsync(req.body);
    const {name, description, manager, password} = validation;
		
		//order 값을 부여하기 위한 로직
    const productMaxOrder = await Product.findOne().sort('-order').exec();
    const order = productMaxOrder ? productMaxOrder.order + 1 : 1;
		
		//제품 등록시 상태를 자동으로 FOR_SALE로 지정하고, 생성일, 수정일을 일괄 지정
    const status = "FOR_SALE";
    const createdAt = new Date();
    const updatedAt = new Date();

		//새로운 제품을 생성하기위해 스키마를 이용해 객체로 생성후 몽고디비에 저장
    const product = new Product({order, name, description, manager, password, status, createdAt, updatedAt});
    await product.save();

		//password를 제외한 나머지 정보를 response에 전달하기위한 로직
    const { password: _, ...resData } = product.toObject();
    
    //최종 메시지 전달
    return res.status(201).json({
      status: 201,
      message: '상품 생성에 성공했습니다.',
      data: resData
    })
	//에러를 미들웨어로 전달하기 위함
  }catch(error){
    next(error);

  }
});

/* 상품 목록 조회 API */
router.get('/products', async (req, res, next) => {

	//단순 조회로직
  const products = await Product.find().sort('-createAt').exec();
  //단순 응답객체이며, 아무것도 없을경우 빈 배열
  //map 을 활용하여 비밀번호를 제외한 정보를 전달한다.
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
  // params로 전달할 id 
  const { productId } = req.params;
  
  try {
	  // 몽고디비의 id 값의 유효성에러 처리
    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
	  //상 품 조회가 실패하였을때 처리
    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
	  // 패스워드 항목을 언더바로 지정해두고, resData 객체를 .object에서 가저옴
    const { password: _, ...resData } = product.toObject();

	  // response 메시지 생성
    return res.status(200).json({
      status: 200,
      message: '상품 상세 조회에 성공했습니다.',
      data: resData,
    });
  } catch (error) {
  //미들웨어 처리
    next(error);
  }
});

/* 상품 수정 API */
router.put('/products/:productId', async (req, res, next) => {
  // params로 전달할 id 
  const { productId } = req.params;

  try {
	  // Body의 입력값 유효성 검사 로직
    const validation = await updateProductSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = validation;

		// 몽고디비의 id 값의 유효성에러 처리
    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
		
		// 검색결과가 없을때 에러처리
    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
		// 패스워드 비교
    if (product.password !== password) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }
		// 각 입력값이 있을경우, 입력받은 값을 객체의 값과 교체
    if (name) product.name = name;
    if (description) product.description = description;
    if (manager) product.manager = manager;
    if (status) product.status = status;
    
    // 업데이트 시간을 수정하는 로직
    const updatedAt = new Date();
    product.updatedAt = updatedAt;

		// 객체를 몽고디비에 저장
    await product.save();

		// 비밀번호를 제외한 응답객체 만들기
    const { password: _, ...resData } = product.toObject();
		
		// 응답처리
    return res.status(200).json({
      status: 200,
      message: '상품 수정에 성공했습니다.',
      data: resData,
    });
  } catch (error) {
	  // 미들웨어로 보내기
    next(error);
  }
});

/* 상품 삭제 API */
router.delete('/products/:productId', async (req, res, next) => {
  // params로 전달할 id 
  const { productId } = req.params;

  try {
	  //패스워드값 유효성 검사 로직
    const validation = await deleteProductSchema.validateAsync(req.body);
    const { password } = validation;

		// 몽고디비의 id 값의 유효성에러 처리
    if (!mongoose.isValidObjectId(productId)) {
      const error = new Error('잘못된 id값 입니다.');
      error.status = 404;
      throw error;
    }
		
		// 검색결과가 없을때 에러처리
    const product = await Product.findById(productId).exec();
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

		// 패스워드 비교
    if (product.password !== password) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }

		// 몽고디비에서 객체 삭제하기
    await product.deleteOne();

		// 응답처리
    return res.status(200).json({
      status: 200,
      message: '상품 삭제에 성공했습니다.',
      data: {
        id: productId,
      },
    });
  } catch (error) {
  // 미들웨어로 보내기
    next(error);
  }
});

export default router;
```