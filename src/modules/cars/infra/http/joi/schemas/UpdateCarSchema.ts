import Joi from 'joi';

export const UpdateCarSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
  model: Joi.string().required().max(100).min(1),
  color: Joi.string().required().max(100).min(1),
  year: Joi.number().integer().min(1950).max(2023).required().messages({
    'number.min': 'Year must be at least 1950',
    'number.max': 'Year must be at most 2023',
  }),
  value_per_day: Joi.number().required().positive(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required().min(3).max(100),
        _id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
          .messages({
            'string.pattern.name':
              'The accessory id is in an invalid format. Please insert a valid ObjectId and try again.',
          })
          .required(),
      }),
    )
    .required(),
  number_of_passengers: Joi.number().required().integer().positive(),
});
