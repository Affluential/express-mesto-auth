// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
  return next();
};
module.exports = errorHandler;
