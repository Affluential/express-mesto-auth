const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { BadRequest } = require('../errors/index');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/user');

const urlIsValid = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new BadRequest('Ссылка не верна');
};

const profileIsValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
const avatarIsValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlIsValid),
  }),
});
const userIdIsValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', userIdIsValid, getUser);
router.patch('/me', profileIsValid, updateUser);
router.patch('/me/avatar', avatarIsValid, updateAvatar);

module.exports = router;
