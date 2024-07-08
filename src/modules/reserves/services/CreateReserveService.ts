import { inject, injectable } from 'tsyringe';
import { IReservesRepository } from '../domain/models/repositories/ReservesRepository.interface';
import { IUsersRepository } from '@modules/users/domain/models/repositories/UsersRepository.interface';
import { ICarsRepository } from '@modules/cars/domain/models/repositories/CarsRepository.interface';
import { CreateReserveDto } from '../domain/dtos/CreateReserve.dto';
import { ReserveResponseDto } from '../domain/dtos/ReserveResponse.dto';
import { NotFoundError } from '@shared/errors/NotFoundError';
import {
  CAR_NOT_FOUND,
  INVALID_START_OR_END_DATE,
  USER_ALREADY_HAVE_RESERVE,
  USER_DONT_QUALIFIED,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorResponseMessageConsts';
import { BadRequestError } from '@shared/errors/BadRequestError';
import ReserveResponseMapper from '../domain/mappings/ReserveResponseMapper';
import { ReserveFinalValueHelper } from './helpers/ReserveFinalValueHelper';
import { isAfter, isBefore, parse } from 'date-fns';
import { ObjectId } from 'mongodb';
import { ReserveTimeIntervalValidator } from './validators/ReserveTimeIntervalValidator';

@injectable()
class CreateReserveService {
  constructor(
    @inject('ReservesRepository')
    private reserveRepository: IReservesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute(
    createReserveDTO: CreateReserveDto,
  ): Promise<ReserveResponseDto> {
    const reserveTimeIntervalValidator = new ReserveTimeIntervalValidator(
      this.reserveRepository,
    );

    const { start_date, end_date, id_user, id_car } = createReserveDTO;
    const startDate = parse(start_date.toString(), 'dd/MM/yyyy', new Date());
    const endDate = parse(end_date.toString(), 'dd/MM/yyyy', new Date());

    const user = await this.usersRepository.findById(new ObjectId(id_user));
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }
    if (user.qualified.toString() === 'no') {
      throw new BadRequestError(USER_DONT_QUALIFIED);
    }

    const car = await this.carsRepository.findById(new ObjectId(id_car));
    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    const userAlreadyHaveReserveInTime =
      await this.reserveRepository.findByUserAndTime(
        createReserveDTO.id_user,
        createReserveDTO.start_date,
        createReserveDTO.end_date,
      );

    if (userAlreadyHaveReserveInTime) {
      throw new BadRequestError(USER_ALREADY_HAVE_RESERVE);
    }

    if (
      isAfter(new Date(), startDate) ||
      isAfter(new Date(), endDate) ||
      isBefore(endDate, startDate)
    ) {
      throw new BadRequestError(INVALID_START_OR_END_DATE);
    }

    await reserveTimeIntervalValidator.validateReservation(
      new ObjectId(id_car),
      new ObjectId(id_user),
      startDate,
      endDate,
    );

    const reserve = await this.reserveRepository.create(createReserveDTO);

    reserve.final_value = await ReserveFinalValueHelper.execute(
      startDate,
      endDate,
      car.value_per_day,
    );

    await this.reserveRepository.save(reserve);

    return ReserveResponseMapper.response(reserve);
  }
}

export default CreateReserveService;
