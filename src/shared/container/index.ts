import 'reflect-metadata';
import { IUsersRepository } from '@modules/users/domain/models/repositories/UsersRepository.interface';
import UsersRepository from '@modules/users/infra/typeorm/repositories/implementation/UsersRepository';
import { container } from 'tsyringe';
import { IHashProvider } from '@modules/users/providers/hashProvider/models/IHashProvider';
import BcryptHashProvider from '@modules/users/providers/hashProvider/implementations/BcryptHashProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
