import { ObjectId } from 'mongodb';

import { CarResponseDto } from '../../dtos/CarResponse.dto';
import { ICar } from '../entities/ICar';
import { CreateCarDto } from '../../dtos/CreateCar.dto';
import { PaginationCarsParamsDto } from '../../dtos/PaginationCarsParams.dto';
import { PaginatedCarResultDto } from '../../dtos/PaginatedCarResult.dto';

export interface ICarsRepository {
  findAll(
    params: PaginationCarsParamsDto,
  ): Promise<PaginatedCarResultDto<CarResponseDto>>;
  findById(id: ObjectId): Promise<ICar | null>;
  create(createCarDTO: CreateCarDto): Promise<ICar>;
  save(car: ICar): Promise<ICar>;
  remove(car: ICar): Promise<void>;
}
