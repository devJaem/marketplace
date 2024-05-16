### error-handler.middleware.js
---
```javascript
export default (err, req, res, next) => {
  
  // Joi 유효성검사 에러를 처리
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

	// 에러 상태코드가 401일 경우의 에러처리
  if (err.status === 401) {
    return res.status(401).json({
      status: 401,
      message: err.message,
    });
  }
  
	// 에러 상태코드가 404일 경우의 에러처리
  if (err.status === 404) {
    return res.status(404).json({
      status: 404,
      message: err.message,
    });
  }


  // 에러 상태코드가 409일 경우 에러처리
  if (err.status === 409) {
    return res.status(409).json({
      status: 409,
      message: err.message,
    });
  }
	
	//위에 아무것도 해당되지 않는 오류일 경우의 에러처리
  return res.status(500).json({
    status: 500,
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};


```