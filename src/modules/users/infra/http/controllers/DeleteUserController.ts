import DeleteUserService from '@modules/users/services/DeleteUserService';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class DeleteUserController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute(new ObjectId(id));

    return response.status(HttpStatusCode.NoContent).json();
  }
}

export default DeleteUserController;
