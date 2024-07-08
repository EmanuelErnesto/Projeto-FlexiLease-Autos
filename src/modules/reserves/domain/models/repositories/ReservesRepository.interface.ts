import { ObjectId } from 'mongodb';
import { PaginatedReserveResultDto } from '../../dtos/PaginatedReserveResult.dto';
import { PaginationReserveParamsDto } from '../../dtos/PaginationReserveParams.dto';
import { ReserveResponseDto } from '../../dtos/ReserveResponse.dto';
import { IReserve } from '../entities/IReserve';
import { CreateReserveDto } from '../../dtos/CreateReserve.dto';

export interface IReservesRepository {
  findAll(
    params: PaginationReserveParamsDto,
  ): Promise<PaginatedReserveResultDto<ReserveResponseDto>>;
  findById(_id: ObjectId): Promise<IReserve | null>;
  findByCarId(id_car: ObjectId): Promise<IReserve[] | null>;
  findByUserId(id_user: ObjectId): Promise<IReserve[] | null>;
  findByUserAndTime(
    id_user: ObjectId,
    start_date: Date,
    end_date: Date,
  ): Promise<IReserve | null>;

  create(createReserveDto: CreateReserveDto): Promise<IReserve>;
  save(reserve: IReserve): Promise<IReserve>;
  remove(reserve: IReserve): Promise<void>;
}
