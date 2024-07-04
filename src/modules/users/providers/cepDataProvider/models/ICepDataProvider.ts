import { UserCepResponseDto } from '@modules/users/domain/dtos/UserCepResponse.dto';

export interface ICepDataProvider {
  pull(cep: string): Promise<UserCepResponseDto>;
}
