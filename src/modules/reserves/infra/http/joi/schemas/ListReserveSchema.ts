import Joi from 'joi';

export const ListReserveSchema = Joi.object({
  limit: Joi.number().integer().min(1).optional(),
  offset: Joi.number().integer().min(0).optional(),
  id_user: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id of user is in an invalid format. Please insert a valid ObjectId and try again.',
    }),
  start_date: Joi.string()
    .optional()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  end_date: Joi.string()
    .optional()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  id_car: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, 'Object id')
    .messages({
      'string.pattern.name':
        'The id of car is in an invalid format. Please insert a valid ObjectId and try again.',
    })
    .optional(),
  final_value: Joi.number().positive().precision(10).strict().optional(),
});
