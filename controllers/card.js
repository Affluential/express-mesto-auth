const Card = require('../models/card');
const { BadRequest, NotFound, Forbidden } = require('../errors/index');

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

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        card.remove();
        return res.status(200).send({ message: 'Карточка удалена' });
      }
      throw new Forbidden('Нельзя удалять чужие карточки');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};
