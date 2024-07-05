import { CreateCarDto } from '@modules/cars/domain/dtos/CreateCar.dto';
import CreateCarService from '@modules/cars/services/CreateCarService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class CreateCarController {
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

    const createCarService = container.resolve(CreateCarService);

    const createCar: CreateCarDto = {
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    };

    const car = await createCarService.execute(createCar);

    return response.status(HttpStatusCode.CREATED).json(car);
  }
}

export default CreateCarController;
