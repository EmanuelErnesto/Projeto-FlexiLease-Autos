import Joi from 'joi';

export const ListCarSchema = Joi.object({
  limit: Joi.number().integer().min(1).optional(),
  offset: Joi.number().integer().min(0).optional(),
  model: Joi.string().optional(),
  color: Joi.string().optional(),
  year: Joi.string().optional(),
  value_per_day: Joi.number().optional(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
      }),
    )
    .optional(),
  number_of_passengers: Joi.number().integer().optional(),
});
