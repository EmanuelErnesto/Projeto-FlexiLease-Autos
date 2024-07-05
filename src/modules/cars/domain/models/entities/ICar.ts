import { ObjectId } from 'mongodb';
import { IAccessorie } from './IAccessory';

export interface ICar {
  _id: ObjectId;
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: IAccessorie[];
  number_of_passengers: number;
}
