import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ObjectId } from 'mongodb';
import ShowReserveService from '@modules/reserves/services/ShowReserveService';

class ShowReserveController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showReserveService = container.resolve(ShowReserveService);

    const user = await showReserveService.execute(new ObjectId(id));

    return response.status(HttpStatusCode.Ok).json(user);
  }
}

export default ShowReserveController;
