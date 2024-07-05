import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';
import { CreateCarDto } from '../domain/dtos/CreateCar.dto';
import { CarResponseDto } from '../domain/dtos/CarResponse.dto';
import { AccessoryCarValidator } from './validators/AccessoryCarValidator';
import { BadRequestError } from '@shared/errors/BadRequestError';
import {
  INSUFFICIENT_ACCESSORY,
  INVALID_ACCESSORY,
} from '@shared/consts/ErrorResponseMessageConsts';
import CarResponseMapper from '../domain/mappings/CarResponseMapper';
import { ObjectId } from 'mongodb';

@injectable()
class CreateCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}
  public async execute(createCar: CreateCarDto): Promise<CarResponseDto> {
    const validateCarAccessory = await AccessoryCarValidator.validate(
      createCar.accessories,
    );

    if (!validateCarAccessory) {
      throw new BadRequestError(INVALID_ACCESSORY);
    }

    if (createCar.accessories.length <= 0) {
      throw new BadRequestError(INSUFFICIENT_ACCESSORY);
    }

    createCar.accessories.forEach(accessory => {
      accessory._id = new ObjectId();
    });

    const car = await this.carsRepository.create(createCar);

    await this.carsRepository.save(car);

    return CarResponseMapper.response(car);
  }
}

export default CreateCarService;
