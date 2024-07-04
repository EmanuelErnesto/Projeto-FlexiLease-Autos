import { UpdateUserDto } from '@modules/users/domain/dtos/UpdateUser.dto';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class UpdateUserController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { name, cpf, birth, email, password, old_password, cep, qualified } =
      request.body;
    const { id } = request.params;
    const updateUserService = container.resolve(UpdateUserService);

    const updateUser: UpdateUserDto = {
      _id: new ObjectId(id),
      name,
      cpf,
      birth,
      email,
      password,
      old_password,
      cep,
      qualified,
    };

    const user = await updateUserService.execute(updateUser);

    return response.status(HttpStatusCode.Ok).json(user);
  }
}

export default UpdateUserController;
