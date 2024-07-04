import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute(id: ObjectId): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    await this.usersRepository.remove(user);
  }
}

export default DeleteUserService;
