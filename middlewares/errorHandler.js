const mongoose = require('mongoose');
const { CelebrateError } = require('celebrate');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err instanceof mongoose.CastError) {
    return res.status(400).send({ message: 'id пользователя не верно' });
  }
  if (err instanceof CelebrateError) {
    return res
      .status(400)
      .send({ message: 'Ошибка валидации почты или пароля' });
  }
  return res.status(500).send({ message: err.message });
};

module.exports = errorHandler;
