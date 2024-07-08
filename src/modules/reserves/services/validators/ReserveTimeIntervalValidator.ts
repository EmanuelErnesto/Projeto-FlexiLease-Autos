import { IReservesRepository } from '@modules/reserves/domain/models/repositories/ReservesRepository.interface';
import {
  CAR_ALREADY_RESERVED,
  USER_ALREADY_HAVE_RESERVE,
} from '@shared/consts/ErrorResponseMessageConsts';
import { BadRequestError } from '@shared/errors/BadRequestError';
import { ObjectId } from 'mongodb';

export class ReserveTimeIntervalValidator {
  constructor(private reserveRepository: IReservesRepository) {}

  public async validateReservation(
    id_car: ObjectId,
    id_user: ObjectId,
    start_date: Date,
    end_date: Date,
  ): Promise<void> {
    await this.checkCarReservationOverlap(id_car, start_date, end_date);
    await this.checkUserReservationOverlap(id_user, start_date, end_date);
  }

  private async checkCarReservationOverlap(
    id_car: ObjectId,
    start_date: Date,
    end_date: Date,
  ): Promise<void> {
    const existingReserves = await this.reserveRepository.findByCarId(id_car);

    if (!existingReserves) {
      return;
    }

    for (const reserve of existingReserves) {
      if (
        this.datesOverlap(
          reserve.start_date,
          reserve.end_date,
          start_date,
          end_date,
        )
      ) {
        throw new BadRequestError(CAR_ALREADY_RESERVED);
      }
    }
  }

  private async checkUserReservationOverlap(
    id_user: ObjectId,
    start_date: Date,
    end_date: Date,
  ): Promise<void> {
    const existingReserves = await this.reserveRepository.findByUserId(id_user);

    if (!existingReserves) {
      return;
    }

    for (const reserve of existingReserves) {
      if (
        this.datesOverlap(
          reserve.start_date,
          reserve.end_date,
          start_date,
          end_date,
        )
      ) {
        throw new BadRequestError(USER_ALREADY_HAVE_RESERVE);
      }
    }
  }

  private datesOverlap(
    start_date: Date,
    end_date1: Date,
    start_date2: Date,
    end_date2: Date,
  ): boolean {
    return start_date <= end_date2 && end_date1 >= start_date2;
  }
}
