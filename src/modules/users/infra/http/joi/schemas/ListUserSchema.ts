import Joi from 'joi';

export const ListUserSchema = Joi.object({
  limit: Joi.number().integer().min(1).optional(),
  offset: Joi.number().integer().min(0).optional(),
  name: Joi.string().optional(),
  birth: Joi.date().optional(),
  cep: Joi.string()
    .pattern(/^\d{8}$/)
    .optional(),
  qualified: Joi.string().valid('yes', 'no').optional(),
  patio: Joi.string().optional(),
  complement: Joi.string().optional(),
  neighborhood: Joi.string().optional(),
  locality: Joi.string().optional(),
  uf: Joi.string().length(2).optional(),
});
