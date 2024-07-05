import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'typeorm';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';
import { CarResponseDto } from '../domain/dtos/CarResponse.dto';
import CarResponseMapper from '../domain/mappings/CarResponseMapper';

@injectable()
class ShowCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}
  public async execute(id: ObjectId): Promise<CarResponseDto> {
    const user = await this.carsRepository.findById(id);

    if (!user) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    return CarResponseMapper.response(user);
  }
}

export default ShowCarService;
