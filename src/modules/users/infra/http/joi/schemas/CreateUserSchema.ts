import Joi from 'joi';

export const CreateUserSchema = Joi.object({
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
  password: Joi.string().required().min(6),
  cep: Joi.string()
    .required()
    .pattern(/^\d{8}$/),
  qualified: Joi.string().required().valid('yes', 'no'),
});
