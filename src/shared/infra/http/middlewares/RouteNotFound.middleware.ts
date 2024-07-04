import { ROUTE_INVALID } from '@shared/consts/ErrorResponseMessageConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';

export const RouteNotFound = (request: Request, response: Response) => {
  response.status(HttpStatusCode.NOT_FOUND).json(ROUTE_INVALID);
};
