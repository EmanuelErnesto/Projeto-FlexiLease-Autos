import { ObjectId } from 'typeorm';
import { Qualified } from '../../enums/Qualified';

export interface IUser {
  _id: ObjectId;
  name: string;
  cpf: string;
  birth: Date;
  email: string;
  password: string;
  cep: string;
  qualified: Qualified;
  patio: string;
  complement: string;
  neighborhood: string;
  locality: string;
  uf: string;
}
