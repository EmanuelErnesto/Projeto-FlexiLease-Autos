import { ObjectId } from 'mongodb';

export class UpdateAccessoryDto {
  readonly _id: ObjectId;
  readonly car_id: ObjectId;
  readonly description: string;
}
