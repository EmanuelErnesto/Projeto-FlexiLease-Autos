import { SOMETHING_WRONG } from '@shared/consts/ErrorResponseMessageConsts';
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
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    let details: any[] = [];
    if (Array.isArray(error)) {
      details = error.map(err => err.message);
    } else if (error instanceof Error) {
      details.push(error.message);
    } else if (typeof error === 'string') {
      details.push(error);
    }
    return response.status(HttpStatusCode.INTERNAL_SERVER).json({
      code: HttpStatusCode.INTERNAL_SERVER,
      status: HttpStatusResponse.INTERNAL_SERVER,
      message: SOMETHING_WRONG,
      details: error.message,
    });
  }

  return next();
};
