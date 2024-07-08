import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { IReservesRepository } from '../domain/models/repositories/ReservesRepository.interface';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';

@injectable()
class DeleteReserveService {
  constructor(
    @inject('ReservesRepository')
    private reservesRepository: IReservesRepository,
  ) {}
  public async execute(id: ObjectId): Promise<void> {
    const reserve = await this.reservesRepository.findById(id);

    if (!reserve) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    await this.reservesRepository.remove(reserve);
  }
}

export default DeleteReserveService;
