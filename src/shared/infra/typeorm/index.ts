import { DataSource } from 'typeorm';
import { User } from '@modules/users/infra/typeorm/entities/User';
import 'dotenv/config';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Reserve } from '@modules/reserves/infra/typeorm/entities/Reserve';

export const dataSource = new DataSource({
  type: 'mongodb',
  database: process.env.DATABASE,
  synchronize: false,
  host: 'localhost',
  port: 27017,
  entities: [User, Car, Reserve],
});
