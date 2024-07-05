import Joi from 'joi';

export const CreateCarSchema = Joi.object({
  model: Joi.string().required().max(100).min(3),
  color: Joi.string().required().max(100).min(3),
  year: Joi.number().integer().min(1950).max(2023).required().messages({
    'number.min': 'Year must be at least 1950',
    'number.max': 'Year must be at most 2023',
  }),
  value_per_day: Joi.number().required().positive(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required().min(3).max(100),
      }),
    )
    .required(),
  number_of_passengers: Joi.number().required().integer().positive(),
});
