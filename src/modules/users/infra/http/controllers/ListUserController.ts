import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUserService from '@modules/users/services/ListUserService';
import { PaginationParamsDto } from '@modules/users/domain/dtos/PaginationParams.dto';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';

class ListUserController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { limit, offset, ...query } = request.query;

    const params: PaginationParamsDto = {
      limit: parseInt(limit as string, 10) || 10,
      offset: parseInt(offset as string, 10) || 0,
      ...query,
    };
    const listUserService = container.resolve(ListUserService);

    const result = await listUserService.execute(params);

    return response.status(HttpStatusCode.Ok).json(result);
  }
}

export default ListUserController;
