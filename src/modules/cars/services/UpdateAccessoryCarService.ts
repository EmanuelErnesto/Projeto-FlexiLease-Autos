import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import { AccessoryCarUpdateValidator } from './validators/AccessoryCarUpdateValidator';
import { UpdateAccessoryDto } from '../domain/dtos/UpdateAccessory.dto';
import UpdateCarAccessoryResponseMapper from '../domain/mappings/UpdateCarAccessoryResponseMapper';
import { UpdateAccessoryCarResponseDto } from '../domain/dtos/UpdateAccessoryCarResponse.dto';

@injectable()
class UpdateAccessoryCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute(
    updateAccessory: UpdateAccessoryDto,
  ): Promise<UpdateAccessoryCarResponseDto> {
    const car = await this.carsRepository.findById(updateAccessory.car_id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    await AccessoryCarUpdateValidator.validate(car, [
      {
        _id: updateAccessory._id,
        description: updateAccessory.description,
      },
    ]);

    await this.carsRepository.save(car);

    return UpdateCarAccessoryResponseMapper.response(updateAccessory);
  }
}

export default UpdateAccessoryCarService;
