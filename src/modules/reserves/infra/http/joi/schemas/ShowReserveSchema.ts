import Joi from 'joi';

export const ShowReserveSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The reserve id is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
});
