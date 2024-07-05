import { ObjectId } from 'mongodb';

export interface IAccessory {
  _id: ObjectId;
  description: string;
}
