import { ObjectId } from 'mongodb';

export class UpdateReserveDto {
  readonly id_user: ObjectId;
  readonly _id: ObjectId;
  readonly start_date: Date;
  readonly end_date: Date;
  readonly id_car: ObjectId;
}
