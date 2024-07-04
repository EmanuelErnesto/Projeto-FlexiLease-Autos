import { CreateUserDto } from '@modules/users/domain/dtos/CreateUser.dto';
import CreateUserService from '@modules/users/services/CreateUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class CreateUserController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { name, cpf, birth, email, password, cep, qualified } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const createUser: CreateUserDto = {
      name,
      cpf,
      birth,
      email,
      password,
      cep,
      qualified,
    };

    const user = await createUserService.execute(createUser);

    return response.status(HttpStatusCode.CREATED).json(user);
  }
}

export default CreateUserController;
