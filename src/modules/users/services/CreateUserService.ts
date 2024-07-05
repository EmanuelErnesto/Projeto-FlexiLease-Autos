import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { CreateUserDto } from '../domain/dtos/CreateUser.dto';
import { UserResponseDto } from '../domain/dtos/UserResponse.dto';
import { BadRequestError } from '@shared/errors/BadRequestError';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  INSUFFICIENT_AGE,
} from '@shared/consts/ErrorResponseMessageConsts';
import UserResponseMapper from '../domain/mappings/UserResponseMapper';
import { IHashProvider } from '../providers/hashProvider/models/IHashProvider';
import { addYears, isBefore } from 'date-fns';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute(createUser: CreateUserDto): Promise<UserResponseDto> {
    const userEmailExists = await this.usersRepository.findByEmail(
      createUser.email,
    );

    if (userEmailExists) {
      throw new BadRequestError(EMAIL_ALREADY_USED);
    }

    const userCpfExists = await this.usersRepository.findByCpf(createUser.cpf);

    if (userCpfExists) {
      throw new BadRequestError(CPF_ALREADY_USED);
    }
    const userBirth = createUser.birth;

    const compareDate = addYears(userBirth, 18);

    if (isBefore(Date.now(), compareDate)) {
      throw new BadRequestError(INSUFFICIENT_AGE);
    }
    const hashedPassword = await this.hashProvider.generateHash(
      createUser.password,
    );

    const user = await this.usersRepository.create({
      ...createUser,
      password: hashedPassword,
    });

    const userWithAddress = await UserResponseMapper.format(user);

    await this.usersRepository.save(userWithAddress);

    return UserResponseMapper.response(userWithAddress);
  }
}

export default CreateUserService;
