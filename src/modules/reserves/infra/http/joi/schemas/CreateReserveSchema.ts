import Joi from 'joi';

export const CreateReserveSchema = Joi.object({
  id_user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id of user is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
  start_date: Joi.string()
    .required()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  end_date: Joi.string()
    .required()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  id_car: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id of car is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .required(),
});
