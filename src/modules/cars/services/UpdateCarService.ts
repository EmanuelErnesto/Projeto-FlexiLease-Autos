import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';
import { UpdateCarDto } from '../domain/dtos/UpdateCar.dto';
import { NotFoundError } from '@shared/errors/NotFoundError';
import {
  CAR_NOT_FOUND,
  INSUFFICIENT_ACCESSORY,
  INVALID_ACCESSORY,
} from '@shared/consts/ErrorResponseMessageConsts';
import { AccessoryCarValidator } from './validators/AccessoryCarValidator';
import { BadRequestError } from '@shared/errors/BadRequestError';
import CarResponseMapper from '../domain/mappings/CarResponseMapper';
import { CarResponseDto } from '../domain/dtos/CarResponse.dto';
import { AccessoryCarUpdateValidator } from './validators/AccessoryCarUpdateValidator';

@injectable()
class UpdateCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute(updateCar: UpdateCarDto): Promise<CarResponseDto> {
    const car = await this.carsRepository.findById(updateCar._id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    const validateCarAccessory = await AccessoryCarValidator.validate(
      updateCar.accessories,
    );

    if (!validateCarAccessory) {
      throw new BadRequestError(INVALID_ACCESSORY);
    }

    if (updateCar.accessories.length <= 0) {
      throw new BadRequestError(INSUFFICIENT_ACCESSORY);
    }

    await AccessoryCarUpdateValidator.validate(car, updateCar.accessories);

    car.model = updateCar.model;
    car.color = updateCar.color;
    car.year = updateCar.year;
    car.value_per_day = updateCar.value_per_day;
    car.number_of_passengers = updateCar.number_of_passengers;

    await this.carsRepository.save(car);

    return CarResponseMapper.response(car);
  }
}

export default UpdateCarService;
