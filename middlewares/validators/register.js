const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const register = celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(3).max(30),
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
});

module.exports = register;
