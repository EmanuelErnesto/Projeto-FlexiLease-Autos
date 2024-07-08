import { ObjectId } from 'mongodb';

export class UpdateReserveResponseDto {
  readonly _id: ObjectId;
  readonly id_user: ObjectId;
  readonly start_date: string;
  readonly end_date: string;
  readonly id_car: ObjectId;
  readonly final_value: number;

  constructor(
    _id: ObjectId,
    id_user: ObjectId,
    start_date: string,
    end_date: string,
    id_car: ObjectId,
    final_value: number,
  ) {
    Object.assign(this, {
      _id,
      id_user,
      start_date,
      end_date,
      id_car,
      final_value,
    });
  }
}
