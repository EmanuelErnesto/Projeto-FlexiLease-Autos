import { ObjectId } from 'mongodb';
import { IAccessory } from './IAccessory';

export interface ICar {
  _id: ObjectId;
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: IAccessory[];
  number_of_passengers: number;
}
