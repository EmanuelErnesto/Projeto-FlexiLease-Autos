import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { IReservesRepository } from '../domain/models/repositories/ReservesRepository.interface';
import { ReserveResponseDto } from '../domain/dtos/ReserveResponse.dto';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import ReserveResponseMapper from '../domain/mappings/ReserveResponseMapper';

@injectable()
class ShowReserveService {
  constructor(
    @inject('ReservesRepository')
    private reservesRepository: IReservesRepository,
  ) {}

  public async execute(id: ObjectId): Promise<ReserveResponseDto> {
    const reserve = await this.reservesRepository.findById(id);

    if (!reserve) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    return ReserveResponseMapper.response(reserve);
  }
}

export default ShowReserveService;
