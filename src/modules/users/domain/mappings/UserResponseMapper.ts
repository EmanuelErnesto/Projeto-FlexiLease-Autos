import CepDataProvider from '@modules/users/providers/cepDataProvider/implementation/CepDataProvider';
import { UserResponseDto } from '../dtos/UserResponse.dto';
import { IUser } from '../models/entities/IUser';

export default class UserResponseMapper {
  static response = (user: IUser): UserResponseDto => {
    const {
      _id,
      name,
      cpf,
      birth,
      email,
      cep,
      qualified,
      patio,
      complement,
      neighborhood,
      locality,
      uf,
    } = user;

    return new UserResponseDto(
      _id,
      name,
      cpf,
      birth,
      email,
      cep,
      qualified,
      patio,
      complement,
      neighborhood,
      locality,
      uf,
    );
  };
  static format = async (user: IUser): Promise<IUser> => {
    const cepDataProvider = new CepDataProvider();
    const addressData = await cepDataProvider.pull(user.cep);
    const userWithAddress = {
      ...user,
      patio: addressData.patio,
      complement: addressData.complement,
      neighborhood: addressData.neighborhood,
      locality: addressData.locality,
      uf: addressData.uf,
    };

    return userWithAddress;
  };
}
