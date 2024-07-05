import { ObjectId } from 'mongodb';

export class UpdateAccessoryCarResponseDto {
  readonly _id: ObjectId;
  readonly description: string;

  constructor(_id: ObjectId, description: string) {
    Object.assign(this, {
      _id,
      description,
    });
  }
}
