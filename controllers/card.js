const mongoose = require('mongoose');
const Card = require('../models/card');
const { BadRequest, NotFound } = require('../errors/index');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((Cards) => res.status(200).send(Cards))
    .catch((err) => res.status(500).send({ message: err.mesage }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(
          'Переданы некорректные данные в метод создания карточки',
        );
      } else {
        res.status(500).send({ message: err.mesage });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('404'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === '404') {
        throw new NotFound('Карточка не найдена');
      }
      if (err instanceof mongoose.CastError) {
        throw new BadRequest('id карточки не верно');
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('404'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === '404') {
        throw new NotFound('Карточка не найдена');
      }
      if (err instanceof mongoose.CastError) {
        throw new BadRequest('id карточки не верно');
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('404'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === '404') {
        throw new NotFound('Карточка не найдена');
      }
      if (err instanceof mongoose.CastError) {
        throw new BadRequest('id карточки не верно');
      }
      return res.status(500).send({ message: err.message });
    });
};
