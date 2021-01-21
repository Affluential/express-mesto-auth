const express = require('express');

const app = express();
const path = require('path');
const router = require('./routes');

const { PORT = 3000 } = process.env;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка 404: Страница не найдена.' });
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-disable no-console */
});
