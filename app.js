require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { BadRequest, NotFound } = require('./errors/index');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/user');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};
app.use(cors(corsOptions));
/* app.use(cors()); */

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

app.use(requestLogger);
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signup',
  celebrate({
    body: {
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(3).max(30),
      avatar: Joi.string().custom(urlIsValid),
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

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-disable no-console */
});
