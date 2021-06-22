const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const cards = require('./routes/cards');
const users = require('./routes/users');

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use((req, res, next) => {
  req.user = {
    _id: '60154d014d7048556ca48eaf',
  };

  next();
});
app.use('/cards', cards);
app.use('/users', users);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-disable no-console */
});
