import { IAccessory } from '@modules/cars/domain/models/entities/IAccessory';
import { ICar } from '@modules/cars/domain/models/entities/ICar';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('cars')
export class Car implements ICar {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'integer', nullable: false })
  year: number;

  @Column({ type: 'integer', nullable: false, unique: true })
  value_per_day: number;

  @Column({ type: 'array', nullable: false })
  accessories: IAccessory[];

  @Column({ type: 'integer', nullable: false })
  number_of_passengers: number;
}
