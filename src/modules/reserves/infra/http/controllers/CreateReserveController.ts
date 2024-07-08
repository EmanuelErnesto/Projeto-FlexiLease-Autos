import { CreateReserveDto } from '@modules/reserves/domain/dtos/CreateReserve.dto';
import CreateReserveService from '@modules/reserves/services/CreateReserveService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class CreateReserveController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { start_date, end_date, id_car, id_user } = request.body;

    const createUserService = container.resolve(CreateReserveService);

    const createReserve: CreateReserveDto = {
      start_date,
      end_date,
      id_car: new ObjectId(id_car),
      id_user: new ObjectId(id_user),
    };

    const reserve = await createUserService.execute(createReserve);

    return response.status(HttpStatusCode.CREATED).json(reserve);
  }
}

export default CreateReserveController;
