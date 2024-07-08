import { inject, injectable } from 'tsyringe';
import { IReservesRepository } from '../domain/models/repositories/ReservesRepository.interface';
import { PaginationReserveParamsDto } from '../domain/dtos/PaginationReserveParams.dto';
import { PaginatedReserveResultDto } from '../domain/dtos/PaginatedReserveResult.dto';
import { ReserveResponseDto } from '../domain/dtos/ReserveResponse.dto';

@injectable()
class ListReserveService {
  constructor(
    @inject('ReservesRepository')
    private reservesRepository: IReservesRepository,
  ) {}

  public async execute(
    params: PaginationReserveParamsDto,
  ): Promise<PaginatedReserveResultDto<ReserveResponseDto>> {
    const result = await this.reservesRepository.findAll(params);

    return result;
  }
}

export default ListReserveService;
