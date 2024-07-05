import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { ICarsRepository } from '@modules/cars/domain/models/repositories/CarsRepository.interface';
import { Car } from '../../entities/Car';
import { CreateCarDto } from '@modules/cars/domain/dtos/CreateCar.dto';
import { ICar } from '@modules/cars/domain/models/entities/ICar';
import { CarResponseDto } from '@modules/cars/domain/dtos/CarResponse.dto';
import { ObjectId } from 'mongodb';
import { PaginationCarsParamsDto } from '@modules/cars/domain/dtos/PaginationCarsParams.dto';
import { PaginatedCarResultDto } from '@modules/cars/domain/dtos/PaginatedCarResult.dto';

export default class CarsRepository implements ICarsRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(Car);
  }

  public async findAll(
    params: PaginationCarsParamsDto,
  ): Promise<PaginatedCarResultDto<CarResponseDto>> {
    /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const whereConditions: any = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'limit' && key !== 'offset') {
        if (
          key === 'year' ||
          key === 'number_of_passengers' ||
          key === 'value_per_day'
        ) {
          whereConditions[key] = Number(value);
        } else if (typeof value === 'string') {
          whereConditions[key] = { $regex: value, $options: 'i' };
        } else {
          whereConditions[key] = value;
        }
      }
    });

    const [cars, total] = await Promise.all([
      this.ormRepository.find({
        where: whereConditions,
        skip: params.offset,
        take: params.limit,
      }),
      this.ormRepository.count(),
    ]);

    const carsPaginated = cars.map(
      car =>
        new CarResponseDto(
          car._id,
          car.model,
          car.color,
          car.year,
          car.value_per_day,
          car.accessories,
          car.number_of_passengers,
        ),
    );

    return new PaginatedCarResultDto(
      carsPaginated,
      total,
      params.limit,
      params.offset,
    );
  }
  public async create(createCarDTO: CreateCarDto): Promise<ICar> {
    const car = this.ormRepository.create(createCarDTO);

    return car;
  }

  public async save(car: ICar): Promise<ICar> {
    await this.ormRepository.save(car);
    return car;
  }

  public async findById(id: ObjectId): Promise<Car | null> {
    const car = await this.ormRepository.findOne({
      where: {
        _id: id,
      },
    });
    return car;
  }

  public async remove(car: Car): Promise<void> {
    await this.ormRepository.remove(car);
  }
}
