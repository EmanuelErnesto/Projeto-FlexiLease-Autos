import { ObjectId } from 'typeorm';
import { Qualified } from '../enums/Qualified';

export class UserResponseDto {
  readonly _id: ObjectId;
  readonly name: string;
  readonly cpf: string;
  readonly birth: Date;
  readonly email: string;
  readonly cep: string;
  readonly qualified: Qualified;
  readonly patio: string;
  readonly complement: string;
  readonly neighborhood: string;
  readonly locality: string;
  readonly uf: string;

  constructor(
    _id: ObjectId,
    name: string,
    cpf: string,
    birth: Date,
    email: string,
    cep: string,
    qualified: Qualified,
    patio: string,
    complement: string,
    neighborhood: string,
    locality: string,
    uf: string,
  ) {
    Object.assign(this, {
      _id,
      name,
      cpf,
      birth,
      email,
      cep,
      qualified,
      patio,
      complement,
      neighborhood,
      locality,
      uf,
    });
  }
}
