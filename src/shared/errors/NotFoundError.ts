import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { AppError } from './AppError';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';

export class NotFoundError extends AppError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.NOT_FOUND,
      HttpStatusResponse.NOT_FOUND,
      message,
      details,
    );
  }
}
