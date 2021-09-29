const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { BadRequest } = require('../errors/index');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const urlIsValid = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new BadRequest('Ссылка не верна');
};

const cardIdIsValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const createCardIsValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlIsValid),
  }),
});

router.get('/', getCards);
router.post('/', createCardIsValid, createCard);
router.delete('/:cardId', cardIdIsValid, deleteCard);
router.put('/:cardId/likes', cardIdIsValid, likeCard);
router.delete('/:cardId/likes', cardIdIsValid, dislikeCard);

module.exports = router;
