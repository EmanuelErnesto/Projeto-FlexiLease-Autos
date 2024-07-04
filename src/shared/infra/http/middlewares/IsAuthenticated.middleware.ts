import {
  JWT_INVALID,
  JWT_MISSING,
} from '@shared/consts/ErrorResponseMessageConsts';
import { UnauthorizedError } from '@shared/errors/UnauthorizedError';
import { NextFunction, Request, Response } from 'express';
import authConfig from '@config/auth';
import { verify } from 'jsonwebtoken';
import ITokenPayload from '../interface/ITokenPayload';
import { BadRequestError } from '@shared/errors/BadRequestError';

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError(JWT_MISSING);
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = authConfig.jwt.secret;

    if (!secret) {
      throw new UnauthorizedError(JWT_MISSING);
    }

    const decodedToken = verify(token, secret) as ITokenPayload;

    const { sub } = decodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new BadRequestError(JWT_INVALID);
  }
}
