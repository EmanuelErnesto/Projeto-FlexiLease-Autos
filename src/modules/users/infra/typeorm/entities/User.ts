import { Qualified } from '@modules/users/domain/enums/Qualified';
import { IUser } from '@modules/users/domain/models/entities/IUser';

import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User implements IUser {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  birth: Date;

  @Column({ type: 'varchar', nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  cep: string;

  @Column({ type: 'enum', nullable: false, enum: ['yes', 'no'] })
  qualified: Qualified;

  @Column({ type: 'varchar', nullable: false })
  patio: string;

  @Column({ type: 'varchar', nullable: false })
  complement: string;

  @Column({ type: 'varchar', nullable: false })
  neighborhood: string;

  @Column({ type: 'varchar', nullable: false })
  locality: string;

  @Column({ type: 'varchar', nullable: false })
  uf: string;
}
