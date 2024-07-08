import { ReserveResponseDto } from '../dtos/ReserveResponse.dto';
import { IReserve } from '../models/entities/IReserve';

export default class ReserveResponseMapper {
  static response = (reserve: IReserve): ReserveResponseDto => {
    const { _id, id_user, start_date, end_date, id_car, final_value } = reserve;

    return new ReserveResponseDto(
      _id,
      id_user,
      start_date,
      end_date,
      id_car,
      final_value,
    );
  };
}
