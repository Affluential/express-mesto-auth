const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/index');

const unauthorizedError = () => {
  throw new Unauthorized('Для доступа необходима авторизация');
};

function extractToken(req) {
  const { cookie } = req.headers;
  if (cookie) {
    const tokenValue = cookie.split().reduce((newObj, item) => {
      const tokenArray = item.split('=');
      return tokenArray[1];
    }, {});
    return tokenValue;
  }
  return undefined;
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    unauthorizedError(res);
  }
  const token = extractToken(req);
  if (!token) {
    unauthorizedError(res);
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      unauthorizedError(res);
    }
    req.user = payload;
    next();
  }
};
