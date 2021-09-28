const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const login = celebrate({
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
});

module.exports = login;
