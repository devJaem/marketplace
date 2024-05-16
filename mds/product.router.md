### product.router.js
---
```javascript
import express from 'express';
import Product from '../schemas/product.schema.js';
import productValidation from '../schemas/product.validation.js';
import productService from '../schemas/product.service.js';

const { createProductSchema, updateProductSchema, deleteProductSchema } = productValidation;
const { validateProductId, findProductById, verifyPassword, checkDuplicateProductName } = productService;

const router = express.Router();

/* 상품 생성 API */
router.post('/products', async (req, res, next) => {
  try{
    //Body에 입력한 json 값을 유효성검증
    const validation = await createProductSchema.validateAsync(req.body);
    const {name, description, manager, password} = validation;
		
    //상품명 중복 확인
    await checkDuplicateProductName(name);

		//order 값을 부여하기 위한 로직
    const productMaxOrder = await Product.findOne().sort('-order').exec();
    const order = productMaxOrder ? productMaxOrder.order + 1 : 1;
		
		//제품 등록시 상태를 자동으로 FOR_SALE로 지정하고, 생성일, 수정일을 일괄 지정
    const status = "FOR_SALE";
    const createdAt = new Date();
    const updatedAt = new Date();

		//새로운 제품을 생성하기위해 스키마를 이용해 객체로 생성후 몽고디비에 저장
    const product = new Product({
      order, 
      name, 
      description, 
      manager, 
      password, 
      status, 
      createdAt, 
      updatedAt});
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
  const { productId } = req.params;
  try {
    // 몽고디비 Id 값의 유효성 검증
    validateProductId(productId);
    // DB검색 , 검색결과 없을떄 에러처리
    const product = await findProductById(productId);
    //결과 객체에서 Password 제거
    const { password: _, ...resData } = product.toObject();
    //결과 반환
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
    //입력값 유효성 검증
    const validation = await updateProductSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = validation;

    // 몽고디비 Id 값의 유효성 검증
    validateProductId(productId);
    // DB검색 , 검색결과 없을떄 에러처리
    const product = await findProductById(productId);
    // 상품명 중복처리
    checkDuplicateProductName(name);
    // 비밀번호 일치 처리
    verifyPassword(product, password);
    //입력받은 정보 처리
    if (name) product.name = name;
    if (description) product.description = description;
    if (manager) product.manager = manager;
    if (status) product.status = status;
    //업데이트 일시 지정
    const updatedAt = new Date();
    product.updatedAt = updatedAt;
    //DB 저장작업
    await product.save();
    //결과 객체에서 Password 제거
    const { password: _, ...resData } = product.toObject();
    //결과 반환
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
    //입력값 유효성 검증
    const validation = await deleteProductSchema.validateAsync(req.body);
    const { password } = validation;
    // 몽고디비 Id 값의 유효성 검증
    validateProductId(productId);
    // DB검색 , 검색결과 없을떄 에러처리
    const product = await findProductById(productId);
    // 비밀번호 일치 처리
    verifyPassword(product, password);
    //삭제작업 수행
    await product.deleteOne();
    //결과 반환
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
```