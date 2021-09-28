const jwt = require('jsonwebtoken');
const { Conflict } = require('../errors/index');

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
    throw new Conflict('Не найдена информация об авторизации');
  }
  const token = extractToken(req);
  if (!token) {
    throw new Conflict('Авторизация не прошла');
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      throw new Conflict('Ошибка авторизации');
    }
    req.user = payload;
    next();
  }
};
