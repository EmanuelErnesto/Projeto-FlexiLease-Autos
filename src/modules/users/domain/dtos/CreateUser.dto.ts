import { Qualified } from '../enums/Qualified';

export class CreateUserDto {
  readonly name: string;
  readonly cpf: string;
  readonly birth: Date;
  readonly email: string;
  readonly password: string;
  readonly cep: string;
  readonly qualified: Qualified;
}
