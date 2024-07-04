import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { AppError } from './AppError';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';

export class BadRequestError extends AppError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.BAD_REQUEST,
      HttpStatusResponse.BAD_REQUEST,
      message,
      details,
    );
  }
}
