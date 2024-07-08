import { IReserve } from '@modules/reserves/domain/models/entities/IReserve';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('reserves')
export class Reserve implements IReserve {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  id_car: ObjectId;

  @ObjectIdColumn()
  id_user: ObjectId;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false, unique: true })
  end_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  final_value: number;
}
