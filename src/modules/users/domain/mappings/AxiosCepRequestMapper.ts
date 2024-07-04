import { UserCepResponseDto } from '../dtos/UserCepResponse.dto';
import { IUserCepRequest } from '../models/entities/IUserCepRequest';

export default class AxiosCepRequestMapper {
  static response(data: IUserCepRequest): UserCepResponseDto {
    return new UserCepResponseDto(
      data.cep,
      data.logradouro,
      data.complemento,
      data.bairro,
      data.localidade,
      data.uf,
    );
  }
}
