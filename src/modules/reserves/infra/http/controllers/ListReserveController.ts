import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { PaginationReserveParamsDto } from '@modules/reserves/domain/dtos/PaginationReserveParams.dto';
import ListReserveService from '@modules/reserves/services/ListReserveService';

class ListReserveController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { limit, offset, ...query } = request.query;

    const params: PaginationReserveParamsDto = {
      limit: parseInt(limit as string, 10) || 10,
      offset: parseInt(offset as string, 10) || 0,
      ...query,
    };
    const listReserveService = container.resolve(ListReserveService);

    const result = await listReserveService.execute(params);

    return response.status(HttpStatusCode.Ok).json(result);
  }
}

export default ListReserveController;
