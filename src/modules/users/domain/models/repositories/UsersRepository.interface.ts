import { ObjectId } from 'typeorm';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { IUser } from '../entities/IUser';
import { PaginationParamsDto } from '../../dtos/PaginationParams.dto';
import { PaginatedResultDto } from '../../dtos/PaginatedResult.dto';

export interface IUsersRepository {
  findAll(params: PaginationParamsDto): Promise<PaginatedResultDto>;
  findByName(name: string): Promise<IUser | null>;
  findById(id: ObjectId): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByCpf(cpf: string): Promise<IUser | null>;
  create(createUserDTO: CreateUserDto): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
}
