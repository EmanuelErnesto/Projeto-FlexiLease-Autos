import { IUserAuthenticated } from '@modules/users/domain/models/entities/IUserAuthenticated';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, password } = request.body;

    const createSessionService = container.resolve(CreateSessionsService);

    const session: IUserAuthenticated = await createSessionService.execute({
      email,
      password,
    });

    return response.status(HttpStatusCode.Ok).json(session);
  }
}
