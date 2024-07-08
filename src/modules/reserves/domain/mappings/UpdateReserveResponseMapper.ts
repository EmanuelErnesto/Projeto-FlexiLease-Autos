import { format } from 'date-fns';
import { UpdateReserveResponseDto } from '../dtos/UpdateReserveResponse.dto';

export default class ReserveResponseMapper {
  static response = (
    reserve: UpdateReserveResponseDto,
  ): UpdateReserveResponseDto => {
    const { _id, id_user, start_date, end_date, id_car, final_value } = reserve;

    return new UpdateReserveResponseDto(
      _id,
      id_user,
      format(start_date, 'dd/MM/yyyy'),
      format(end_date, 'dd/MM/yyyy'),
      id_car,
      final_value,
    );
  };
}
