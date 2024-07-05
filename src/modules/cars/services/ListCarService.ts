import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';
import { CarResponseDto } from '../domain/dtos/CarResponse.dto';
import { PaginationCarsParamsDto } from '../domain/dtos/PaginationCarsParams.dto';
import { PaginatedCarResultDto } from '../domain/dtos/PaginatedCarResult.dto';

@injectable()
class ListCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute(
    params: PaginationCarsParamsDto,
  ): Promise<PaginatedCarResultDto<CarResponseDto>> {
    const result = await this.carsRepository.findAll(params);

    return result;
  }
}

export default ListCarService;
