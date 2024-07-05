import { BadRequestError } from '@shared/errors/BadRequestError';
import { InternalServerError } from '@shared/errors/InternalServerError';
import { NotFoundError } from '@shared/errors/NotFoundError';

export type HttpServerErrors =
  | Error
  | BadRequestError
  | NotFoundError
  | InternalServerError
  | undefined;
