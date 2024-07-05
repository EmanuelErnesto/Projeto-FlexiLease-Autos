import { UpdateCarDto } from '@modules/cars/domain/dtos/UpdateCar.dto';
import UpdateCarService from '@modules/cars/services/UpdateCarService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class UpdateCarController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    } = request.body;
    const { id } = request.params;
    const updateCarService = container.resolve(UpdateCarService);

    const updateCar: UpdateCarDto = {
      _id: new ObjectId(id),
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    };

    const car = await updateCarService.execute(updateCar);

    return response.status(HttpStatusCode.Ok).json(car);
  }
}

export default UpdateCarController;
