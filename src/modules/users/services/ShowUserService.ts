import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { UserResponseDto } from '../domain/dtos/UserResponse.dto';
import { ObjectId } from 'typeorm';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import UserResponseMapper from '../domain/mappings/UserResponseMapper';

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute(id: ObjectId): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    return UserResponseMapper.response(user);
  }
}

export default ShowUserService;
