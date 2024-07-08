import { IReservesRepository } from '@modules/reserves/domain/models/repositories/ReservesRepository.interface';
import { Reserve } from '../../entities/Reserve';
import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { CreateReserveDto } from '@modules/reserves/domain/dtos/CreateReserve.dto';
import { IReserve } from '@modules/reserves/domain/models/entities/IReserve';
import { ObjectId } from 'mongodb';
import { PaginationReserveParamsDto } from '@modules/reserves/domain/dtos/PaginationReserveParams.dto';
import { PaginatedReserveResultDto } from '@modules/reserves/domain/dtos/PaginatedReserveResult.dto';
import { ReserveResponseDto } from '@modules/reserves/domain/dtos/ReserveResponse.dto';

export default class ReservesRepository implements IReservesRepository {
  private ormRepository: Repository<Reserve>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(Reserve);
  }

  public async findAll(
    params: PaginationReserveParamsDto,
  ): Promise<PaginatedReserveResultDto<ReserveResponseDto>> {
    /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const whereConditions: any = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'limit' && key !== 'offset') {
        if (key === 'final_value') {
          whereConditions[key] = Number(value);
        } else if (key === 'id_user' || key === 'id_car') {
          whereConditions[key] = new ObjectId(value as string);
        } else if (typeof value === 'string') {
          whereConditions[key] = { $regex: value, $options: 'i' };
        } else {
          whereConditions[key] = value;
        }
      }
    });

    const [reserves, total] = await Promise.all([
      this.ormRepository.find({
        where: whereConditions,
        skip: params.offset,
        take: params.limit,
      }),
      this.ormRepository.count(),
    ]);

    const reservesPaginated = reserves.map(
      reserve =>
        new ReserveResponseDto(
          reserve._id,
          reserve.id_user,
          reserve.start_date,
          reserve.end_date,
          reserve.id_car,
          reserve.final_value,
        ),
    );

    return new PaginatedReserveResultDto(
      reservesPaginated,
      total,
      params.limit,
      params.offset,
    );
  }

  public async findByUserAndTime(
    id_user: ObjectId,
    start_date: Date,
    end_date: Date,
  ): Promise<IReserve | null> {
    const reserve = await this.ormRepository.findOne({
      where: {
        id_user,
        start_date,
        end_date,
      },
    });

    return reserve;
  }

  public async findByCarId(id_car: ObjectId): Promise<IReserve[] | null> {
    const reserves = await this.ormRepository.find({
      where: {
        id_car,
      },
    });

    return reserves || null;
  }

  public async findByUserId(id_user: ObjectId): Promise<IReserve[] | null> {
    const reserves = await this.ormRepository.find({
      where: {
        id_user,
      },
    });

    return reserves || null;
  }

  public async findById(id: ObjectId): Promise<Reserve | null> {
    const reserve = await this.ormRepository.findOne({
      where: {
        _id: id,
      },
    });
    return reserve || null;
  }

  public async create(createReserveDTO: CreateReserveDto): Promise<IReserve> {
    const reserve = this.ormRepository.create(createReserveDTO);

    return reserve;
  }

  public async save(reserve: Reserve): Promise<Reserve> {
    return await this.ormRepository.save(reserve);
  }

  public async remove(reserve: Reserve): Promise<void> {
    await this.ormRepository.remove(reserve);
  }
}
