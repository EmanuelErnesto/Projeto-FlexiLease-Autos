import { IUsersRepository } from '@modules/users/domain/models/repositories/UsersRepository.interface';
import { ObjectId, Repository } from 'typeorm';
import { User } from '../../entities/User';
import { CreateUserDto } from '@modules/users/domain/dtos/CreateUser.dto';
import { IUser } from '@modules/users/domain/models/entities/IUser';
import { dataSource } from '@shared/infra/typeorm';
import { UserResponseDto } from '@modules/users/domain/dtos/UserResponse.dto';
import { PaginatedResultDto } from '@modules/users/domain/dtos/PaginatedResult.dto';
import { PaginationParamsDto } from '@modules/users/domain/dtos/PaginationParams.dto';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(User);
  }

  public async create(createUserDTO: CreateUserDto): Promise<IUser> {
    const user = this.ormRepository.create(createUserDTO);

    return user;
  }

  public async save(user: IUser): Promise<IUser> {
    await this.ormRepository.save(user);
    return user;
  }

  public async findById(id: ObjectId): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: {
        _id: id,
      },
    });
    return user || null;
  }

  public async findByName(name: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return user || null;
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: {
        cpf,
      },
    });

    return user || null;
  }

  public async remove(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }

  public async findAll(
    params: PaginationParamsDto,
  ): Promise<PaginatedResultDto<UserResponseDto>> {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const query: any = {};

    (Object.keys(params) as (keyof PaginationParamsDto)[]).forEach(key => {
      if (params[key] !== undefined && key !== 'limit' && key !== 'offset') {
        if (typeof params[key] === 'string') {
          query[key] = { $regex: params[key], $options: 'i' };
        } else {
          query[key] = params[key];
        }
      }
    });

    const [users, total] = await Promise.all([
      this.ormRepository.find({
        where: query,
        skip: params.offset,
        take: params.limit,
      }),
      this.ormRepository.count(),
    ]);

    const usersPaginated = users.map(
      user =>
        new UserResponseDto(
          user._id,
          user.name,
          user.cpf,
          user.birth,
          user.email,
          user.cep,
          user.qualified,
          user.patio,
          user.complement,
          user.neighborhood,
          user.locality,
          user.uf,
        ),
    );

    return new PaginatedResultDto(
      usersPaginated,
      total,
      params.limit,
      params.offset,
    );
  }
}
