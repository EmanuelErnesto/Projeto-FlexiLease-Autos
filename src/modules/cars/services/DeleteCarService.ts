import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import { ICarsRepository } from '../domain/models/repositories/CarsRepository.interface';

@injectable()
class DeleteCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}
  public async execute(id: ObjectId): Promise<void> {
    const car = await this.carsRepository.findById(id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    await this.carsRepository.remove(car);
  }
}

export default DeleteCarService;
