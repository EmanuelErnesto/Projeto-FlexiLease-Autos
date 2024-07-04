import axios from 'axios';
import { UserCepResponseDto } from '@modules/users/domain/dtos/UserCepResponse.dto';
import AxiosCepRequestMapper from '@modules/users/domain/mappings/AxiosCepRequestMapper';

class CepDataProvider {
  public async pull(cep: string): Promise<UserCepResponseDto> {
    const request = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    const data = request.data;

    return AxiosCepRequestMapper.response(data);
  }
}

export default CepDataProvider;
