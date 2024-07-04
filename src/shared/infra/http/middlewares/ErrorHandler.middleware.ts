import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { AppError } from '@shared/errors/AppError';
import { HttpServerErrors } from '@shared/types/HttpServerErrors';
import { NextFunction, Request, Response } from 'express';

export const ErrorHandler = (
  error: HttpServerErrors,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error) {
    if (error instanceof AppError) {
      const statusCode = error.code || HttpStatusCode.INTERNAL_SERVER;
      const statusResponse = error.status || HttpStatusResponse.INTERNAL_SERVER;
      return response.status(statusCode).json({
        code: statusCode,
        status: statusResponse,
        message: error.message,
        details: error.details,
      });
    }
  }

  return next();
};
