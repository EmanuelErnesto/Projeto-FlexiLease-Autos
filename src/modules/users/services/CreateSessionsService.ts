import authConfig from '@config/auth';
import { Secret, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { ICreateSession } from '../domain/models/entities/ICreateSession';
import { INCORRECT_COMBINATION } from '@shared/consts/ErrorResponseMessageConsts';
import { IHashProvider } from '../providers/hashProvider/models/IHashProvider';
import { IUserAuthenticated } from '../domain/models/entities/IUserAuthenticated';
import { BadRequestError } from '@shared/errors/BadRequestError';

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({
    email,
    password,
  }: ICreateSession): Promise<IUserAuthenticated> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError(INCORRECT_COMBINATION);
    }

    const passwordConfirmed = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordConfirmed) {
      throw new BadRequestError(INCORRECT_COMBINATION);
    }

    const token = sign({}, authConfig.jwt.secret as Secret, {
      subject: user._id.toString(),
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { token };
  }
}

export default CreateSessionsService;
