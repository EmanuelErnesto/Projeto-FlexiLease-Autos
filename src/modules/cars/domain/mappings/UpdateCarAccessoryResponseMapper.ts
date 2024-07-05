import { UpdateAccessoryDto } from '../dtos/UpdateAccessory.dto';
import { UpdateAccessoryCarResponseDto } from '../dtos/UpdateAccessoryCarResponse.dto';

export default class UpdateCarAccessoryResponseMapper {
  static response = (
    updateAccessory: UpdateAccessoryDto,
  ): UpdateAccessoryCarResponseDto => {
    const { _id, description } = updateAccessory;
    return new UpdateAccessoryCarResponseDto(_id, description);
  };
}
