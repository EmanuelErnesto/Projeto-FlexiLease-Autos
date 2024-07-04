import Joi from 'joi';

export const UpdateUserSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
  name: Joi.string().required().max(100).min(3),
  cpf: Joi.string()
    .required()
    .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  birth: Joi.string()
    .required()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  old_password: Joi.string().min(6),
  password: Joi.string().min(6).optional(),
  password_confirmation: Joi.string()
    .valid(Joi.ref('password'))
    .when('password', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
  cep: Joi.string()
    .required()
    .pattern(/^\d{8}$/),
  qualified: Joi.string().required().valid('yes', 'no'),
});
