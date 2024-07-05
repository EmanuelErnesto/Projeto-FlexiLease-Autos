import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { PaginationCarsParamsDto } from '@modules/cars/domain/dtos/PaginationCarsParams.dto';
import ListCarService from '@modules/cars/services/ListCarService';

class ListCarController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { limit, offset, ...query } = request.query;

    const params: PaginationCarsParamsDto = {
      limit: parseInt(limit as string, 10) || 10,
      offset: parseInt(offset as string, 10) || 0,
      ...query,
    };
    const listCarService = container.resolve(ListCarService);

    const result = await listCarService.execute(params);

    return response.status(HttpStatusCode.Ok).json(result);
  }
}

export default ListCarController;
