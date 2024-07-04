import { ObjectId } from 'mongodb';
import { Qualified } from '../enums/Qualified';

export class UpdateUserDto {
  readonly _id: ObjectId;
  readonly name: string;
  readonly cpf: string;
  readonly birth: Date;
  readonly email: string;
  readonly password?: string;
  readonly old_password?: string;
  readonly cep: string;
  readonly qualified: Qualified;
}
