import { ValidationError } from '@shared/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const RequestUpdateEntityDataValidator = (schema: Joi.ObjectSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const data = {
      ...request.params,
      ...request.body,
    };
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const details = error.details.map(detail => detail.message);
      const validationError = new ValidationError(details);
      return response.status(validationError.code).json(validationError);
    }

    return next();
  };
};
