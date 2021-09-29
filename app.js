const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');

const { BadRequest, NotFound } = require('./errors/index');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/user');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on('open', () => {
  /* eslint-disable no-console */
  console.log('mestoDb connected!');
});
const urlIsValid = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new BadRequest('Ссылка не верна');
};
app.post(
  '/signup',
  celebrate({
    body: {
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(3).max(30),
      avatar: Joi.string().required().custom(urlIsValid),
      password: Joi.string().min(6).max(30).required(),
      email: Joi.string()
        .required()
        .custom((value, halper) => {
          if (validator.isEmail(value)) {
            return value;
          }
          return halper.message('Это не почта');
        }),
    },
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: {
      password: Joi.string().min(6).max(30).required(),
      email: Joi.string()
        .required()
        .custom((value, halper) => {
          if (validator.isEmail(value)) {
            return value;
          }
          return halper.message('Это не почта');
        }),
    },
  }),
  login,
);

app.use('/', auth);
app.use('/cards', cards);
app.use('/users', users);
app.use(errors());

app.use(() => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-disable no-console */
});
