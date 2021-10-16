const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/index');

const unauthorizedError = () => {
  throw new Unauthorized('Для доступа необходима авторизация');
};

module.exports = (req, res, next) => {
  console.log(req.cookies);
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    unauthorizedError(res);
  }
  let payload;
  try {
    payload = jwt.verify(
      jwtToken,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    unauthorizedError(res);
  }
  req.user = payload;
  next();
};
