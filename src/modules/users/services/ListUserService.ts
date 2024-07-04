import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/models/repositories/UsersRepository.interface';
import { PaginationParamsDto } from '../domain/dtos/PaginationParams.dto';
import { PaginatedResultDto } from '../domain/dtos/PaginatedResult.dto';
import { UserResponseDto } from '../domain/dtos/UserResponse.dto';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    params: PaginationParamsDto,
  ): Promise<PaginatedResultDto<UserResponseDto>> {
    const result = await this.usersRepository.findAll(params);

    return result;
  }
}

export default ListUserService;
