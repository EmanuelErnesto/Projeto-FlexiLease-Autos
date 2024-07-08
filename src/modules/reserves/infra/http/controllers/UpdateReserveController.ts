import { UpdateReserveDto } from '@modules/reserves/domain/dtos/UpdateReserve.dto';
import UpdateReserveService from '@modules/reserves/services/UpdateReserveService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class UpdateReserveController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id_user, start_date, end_date, id_car } = request.body;
    const { id } = request.params;
    const updateReserveService = container.resolve(UpdateReserveService);

    const updateReserve: UpdateReserveDto = {
      _id: new ObjectId(id),
      id_user: new ObjectId(id_user),
      start_date,
      end_date,
      id_car: new ObjectId(id_car),
    };

    const reserve = await updateReserveService.execute(updateReserve);

    return response.status(HttpStatusCode.Ok).json(reserve);
  }
}

export default UpdateReserveController;
