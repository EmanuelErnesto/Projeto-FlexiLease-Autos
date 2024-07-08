import { inject, injectable } from 'tsyringe';
import { IReservesRepository } from '../domain/models/repositories/ReservesRepository.interface';
import { ReserveResponseDto } from '../domain/dtos/ReserveResponse.dto';
import { NotFoundError } from '@shared/errors/NotFoundError';
import {
  CAR_NOT_FOUND,
  INVALID_START_OR_END_DATE,
  RESERVE_NOT_FOUND,
  USER_DONT_QUALIFIED,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorResponseMessageConsts';
import { BadRequestError } from '@shared/errors/BadRequestError';
import { ReserveFinalValueHelper } from './helpers/ReserveFinalValueHelper';
import { isAfter, isBefore, parse } from 'date-fns';
import { ReserveTimeIntervalValidator } from './validators/ReserveTimeIntervalValidator';
import ReserveResponseMapper from '../domain/mappings/ReserveResponseMapper';
import { UpdateReserveDto } from '../domain/dtos/UpdateReserve.dto';
import { IUsersRepository } from '@modules/users/domain/models/repositories/UsersRepository.interface';
import { ICarsRepository } from '@modules/cars/domain/models/repositories/CarsRepository.interface';

@injectable()
class UpdateReserveService {
  constructor(
    @inject('ReservesRepository')
    private reserveRepository: IReservesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute(
    updateReserveDto: UpdateReserveDto,
  ): Promise<ReserveResponseDto> {
    const reserveTimeIntervalValidator = new ReserveTimeIntervalValidator(
      this.reserveRepository,
    );

    const startDate = parse(
      updateReserveDto.start_date.toString(),
      'dd/MM/yyyy',
      new Date(),
    );
    const endDate = parse(
      updateReserveDto.end_date.toString(),
      'dd/MM/yyyy',
      new Date(),
    );

    const reserve = await this.reserveRepository.findById(updateReserveDto._id);
    if (!reserve) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    if (
      updateReserveDto.id_user &&
      updateReserveDto.id_user.toString() !== reserve.id_user.toString()
    ) {
      const user = await this.usersRepository.findById(
        updateReserveDto.id_user,
      );

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      if (user.qualified.toString() !== 'yes') {
        throw new BadRequestError(USER_DONT_QUALIFIED);
      }
      reserve.id_user = updateReserveDto.id_user;
    }

    if (
      updateReserveDto.id_car &&
      updateReserveDto.id_car.toString() !== reserve.id_car.toString()
    ) {
      const car = await this.carsRepository.findById(updateReserveDto.id_car);

      if (!car) {
        throw new NotFoundError(CAR_NOT_FOUND);
      }
      reserve.id_car = updateReserveDto.id_car;
      reserve.final_value = await ReserveFinalValueHelper.execute(
        startDate,
        endDate,
        car.value_per_day,
      );
    }

    await reserveTimeIntervalValidator.validateReservation(
      updateReserveDto.id_car,
      updateReserveDto.id_user,
      updateReserveDto.start_date,
      updateReserveDto.end_date,
    );

    if (
      isAfter(new Date(), startDate) ||
      isAfter(new Date(), endDate) ||
      isBefore(endDate, startDate)
    ) {
      throw new BadRequestError(INVALID_START_OR_END_DATE);
    }

    reserve.start_date = updateReserveDto.start_date;
    reserve.end_date = updateReserveDto.end_date;

    await this.reserveRepository.save(reserve);

    const response = ReserveResponseMapper.response(reserve);

    return response;
  }
}

export default UpdateReserveService;
