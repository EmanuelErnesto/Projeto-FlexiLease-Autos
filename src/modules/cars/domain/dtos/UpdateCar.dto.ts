import { ObjectId } from 'mongodb';
import { IAccessory } from '../models/entities/IAccessory';

export class UpdateCarDto {
  readonly _id: ObjectId;
  readonly model: string;
  readonly color: string;
  readonly year: number;
  readonly value_per_day: number;
  readonly accessories: IAccessory[];
  readonly number_of_passengers: number;
}
