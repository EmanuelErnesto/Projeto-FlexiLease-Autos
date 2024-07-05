import { IAccessory } from '../models/entities/IAccessory';

export class PaginationCarsParamsDto {
  readonly limit: number;
  readonly offset: number;
  readonly model?: string;
  readonly color?: string;
  readonly year?: number;
  readonly value_per_day?: number;
  readonly accessories?: IAccessory[];
  readonly number_of_passagers?: number;

  constructor(params: {
    limit: number;
    offset: number;
    model?: string;
    color?: Date;
    year?: string;
    value_per_day?: number;
    accessories?: IAccessory[];
    number_of_passagers?: number;
  }) {
    Object.assign(this, params);
  }
}
