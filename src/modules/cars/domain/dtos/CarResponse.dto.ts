import { ObjectId } from 'mongodb';
import { IAccessory } from '../models/entities/IAccessory';

export class CarResponseDto {
  readonly _id: ObjectId;
  readonly model: string;
  readonly color: string;
  readonly year: number;
  readonly value_per_day: number;
  readonly accessories: IAccessory[];
  readonly number_of_passengers: number;

  constructor(
    _id: ObjectId,
    model: string,
    color: string,
    year: number,
    value_per_day: number,
    accessories: IAccessory[],
    number_of_passengers: number,
  ) {
    Object.assign(this, {
      _id,
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    });
  }
}
