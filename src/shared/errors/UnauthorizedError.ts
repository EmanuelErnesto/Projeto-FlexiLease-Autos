import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { AppError } from './AppError';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: string[]) {
    super(
      HttpStatusCode.UNAUTHORIZED,
      HttpStatusResponse.UNAUTHORIZED,
      message,
      details,
    );
  }
}
