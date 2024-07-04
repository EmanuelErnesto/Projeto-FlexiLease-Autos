import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';

export class AppError extends Error {
  public readonly code: HttpStatusCode;
  public readonly status: HttpStatusResponse;
  public readonly details?: string[];

  constructor(
    code: HttpStatusCode,
    status: HttpStatusResponse,
    message: string,
    details?: string[],
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
