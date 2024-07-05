import ShowUserService from '@modules/users/services/ShowUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ObjectId } from 'mongodb';

class ShowUserController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute(new ObjectId(id));

    return response.status(HttpStatusCode.Ok).json(user);
  }
}

export default ShowUserController;
