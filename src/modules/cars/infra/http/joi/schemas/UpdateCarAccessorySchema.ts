import Joi from 'joi';

export const UpdateCarAccessorySchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
  car_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
  description: Joi.string().required().min(10).max(100),
});
