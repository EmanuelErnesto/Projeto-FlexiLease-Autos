import 'reflect-metadata';
import { IUsersRepository } from '@modules/users/domain/models/repositories/UsersRepository.interface';
import UsersRepository from '@modules/users/infra/typeorm/repositories/implementation/UsersRepository';
import { container } from 'tsyringe';
import { IHashProvider } from '@modules/users/providers/hashProvider/models/IHashProvider';
import BcryptHashProvider from '@modules/users/providers/hashProvider/implementations/BcryptHashProvider';
import { ICarsRepository } from '@modules/cars/domain/models/repositories/CarsRepository.interface';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/implementation/CarsRepository';
import { IReservesRepository } from '@modules/reserves/domain/models/repositories/ReservesRepository.interface';
import ReservesRepository from '@modules/reserves/infra/typeorm/repositories/implementation/ReservesRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);

container.registerSingleton<ICarsRepository>('CarsRepository', CarsRepository);

container.registerSingleton<IReservesRepository>(
  'ReservesRepository',
  ReservesRepository,
);
