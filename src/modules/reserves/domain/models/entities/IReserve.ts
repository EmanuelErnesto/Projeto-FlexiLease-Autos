import { ObjectId } from 'mongodb';

export interface IReserve {
  _id: ObjectId;
  id_user: ObjectId;
  start_date: Date;
  end_date: Date;
  id_car: ObjectId;
  final_value: number;
}
