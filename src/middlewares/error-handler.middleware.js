export default (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  if (err.status === 401) {
    return res.status(401).json({
      status: 401,
      message: err.message,
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      status: 404,
      message: err.message,
    });
  }

  if (err.status === 409) {
    return res.status(409).json({
      status: 409,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 500,
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
