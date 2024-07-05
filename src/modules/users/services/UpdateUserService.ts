import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { IHashProvider } from '../providers/hashProvider/models/IHashProvider';
import { UpdateUserDto } from '../domain/dtos/UpdateUser.dto';
import { UserResponseDto } from '../domain/dtos/UserResponse.dto';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  OLD_PASSWORD_DONT_MATCH,
  OLD_PASSWORD_REQUIRED,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorResponseMessageConsts';
import { NotFoundError } from '@shared/errors/NotFoundError';
import UserResponseMapper from '../domain/mappings/UserResponseMapper';
import { BadRequestError } from '@shared/errors/BadRequestError';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute(updateUser: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(updateUser._id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(
      updateUser.email,
    );

    if (
      userUpdateEmail &&
      userUpdateEmail._id.toString() !== updateUser._id.toString()
    ) {
      throw new BadRequestError(EMAIL_ALREADY_USED);
    }

    if (updateUser.password && !updateUser.old_password) {
      throw new BadRequestError(OLD_PASSWORD_REQUIRED);
    }

    if (updateUser.password && updateUser.old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        updateUser.old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new BadRequestError(OLD_PASSWORD_DONT_MATCH);
      }
      user.password = await this.hashProvider.generateHash(updateUser.password);
    }

    const userUpdateCpf = await this.usersRepository.findByCpf(updateUser.cpf);

    if (
      userUpdateCpf &&
      userUpdateCpf._id.toString() !== updateUser._id.toString()
    ) {
      throw new BadRequestError(CPF_ALREADY_USED);
    }

    user.name = updateUser.name;
    user.cpf = updateUser.cpf;
    user.birth = updateUser.birth;
    user.email = updateUser.email;
    user.cep = updateUser.cep;
    user.qualified = updateUser.qualified;

    const userWithAddress = await UserResponseMapper.format(user);

    await this.usersRepository.save(userWithAddress);

    return UserResponseMapper.response(userWithAddress);
  }
}

export default UpdateUserService;
