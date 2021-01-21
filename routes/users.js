const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const openFile = (req, res, next) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'users.json'), 'utf8', (error, data) => {
    if (error) {
      res.status(500).send({ message: error.message });
      return;
    }
    try {
      req.users = JSON.parse(data);
      next();
    } catch (parseError) {
      res.status(500).send({ message: parseError.message });
    }
  });
};

router.get('/', openFile);
router.get('/', (req, res) => {
  res.send(req.users);
});

router.get('/:id', openFile);
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = req.users.find((item) => item._id === id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
});

module.exports = router;
