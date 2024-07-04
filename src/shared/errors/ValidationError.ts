import { REQUEST_DATA_VALIDATION } from '@shared/consts/ErrorResponseMessageConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';

export class ValidationError {
  code: number;
  status: string;
  message: string;
  details: string[];

  constructor(details: string[]) {
    (this.code = HttpStatusCode.BAD_REQUEST),
      (this.status = HttpStatusResponse.BAD_REQUEST);
    this.message = REQUEST_DATA_VALIDATION;
    this.details = details;
  }
}
