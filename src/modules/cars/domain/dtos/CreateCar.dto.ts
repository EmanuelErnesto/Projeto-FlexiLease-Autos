import { IAccessory } from '../models/entities/IAccessory';

export class CreateCarDto {
  readonly model: string;
  readonly color: string;
  readonly year: number;
  readonly value_per_day: number;
  readonly accessories: IAccessory[];
  readonly number_of_passengers: number;
}
