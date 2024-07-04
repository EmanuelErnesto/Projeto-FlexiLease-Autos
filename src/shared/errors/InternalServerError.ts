import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { AppError } from './AppError';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { SOMETHING_WRONG } from '@shared/consts/ErrorResponseMessageConsts';

export class InternalServerError extends AppError {
  constructor(details: string[]) {
    super(
      HttpStatusCode.INTERNAL_SERVER,
      HttpStatusResponse.INTERNAL_SERVER,
      SOMETHING_WRONG,
      details,
    );
  }
}
