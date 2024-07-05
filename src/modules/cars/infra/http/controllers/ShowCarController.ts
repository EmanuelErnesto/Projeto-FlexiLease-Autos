import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ObjectId } from 'mongodb';
import ShowCarService from '@modules/cars/services/ShowCarService';

class ShowCarController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showCarService = container.resolve(ShowCarService);

    const car = await showCarService.execute(new ObjectId(id));

    return response.status(HttpStatusCode.Ok).json(car);
  }
}

export default ShowCarController;
