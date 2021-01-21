const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'cards.json'), 'utf8', (error, data) => {
    if (error) {
      res.status(500).send({ message: error.message });
      return;
    }
    try {
      const cards = JSON.parse(data);
      res.send(cards);
    } catch (parseError) {
      res.status(500).send({ message: parseError.message });
    }
  });
});

module.exports = router;
