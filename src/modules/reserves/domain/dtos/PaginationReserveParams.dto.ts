import { ObjectId } from 'mongodb';

export class PaginationReserveParamsDto {
  readonly limit: number;
  readonly offset: number;
  readonly id_user?: ObjectId;
  readonly start_date?: Date;
  readonly end_date?: Date;
  readonly id_car?: ObjectId;
  readonly final_value?: number;

  constructor(params: {
    limit: number;
    offset: number;
    id_user?: ObjectId;
    start_date?: Date;
    end_date?: Date;
    id_car?: ObjectId;
    final_value?: number;
  }) {
    Object.assign(this, params);
  }
}
