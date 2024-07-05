import { CarResponseDto } from '../dtos/CarResponse.dto';
import { ICar } from '../models/entities/ICar';

export default class CarResponseMapper {
  static response = (car: ICar): CarResponseDto => {
    const {
      _id,
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    } = car;
    return new CarResponseDto(
      _id,
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    );
  };
}
