import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ObjectId } from 'mongodb';
import UpdateAccessoryCarService from '@modules/cars/services/UpdateAccessoryCarService';

class UpdateCarAccessoryController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, car_id } = request.params;
    const { description } = request.body;

    const updateAccessoryService = container.resolve(UpdateAccessoryCarService);

    const accessory = await updateAccessoryService.execute({
      _id: new ObjectId(id),
      car_id: new ObjectId(car_id),
      description,
    });

    return response.status(HttpStatusCode.Ok).json(accessory);
  }
}

export default UpdateCarAccessoryController;
