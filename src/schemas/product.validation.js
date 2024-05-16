import joi from 'joi';

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

export default {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
};
