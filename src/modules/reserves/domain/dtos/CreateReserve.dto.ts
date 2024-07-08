import { ObjectId } from 'mongodb';

export class CreateReserveDto {
  readonly id_user: ObjectId;
  readonly start_date: Date;
  readonly end_date: Date;
  readonly id_car: ObjectId;
}
