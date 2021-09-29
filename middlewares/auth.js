const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/index');

const unauthorizedError = () => {
  throw new Unauthorized('Для доступа необходима авторизация');
};

module.exports = (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    unauthorizedError(res);
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'some-secret-key');
  } catch (err) {
    unauthorizedError(res);
  }
  req.user = payload;
  next();
};
