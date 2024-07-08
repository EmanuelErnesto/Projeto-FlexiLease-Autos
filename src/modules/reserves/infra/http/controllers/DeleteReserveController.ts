import DeleteReserveService from '@modules/reserves/services/DeleteReserveService';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

class DeleteReserveController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteReserveService = container.resolve(DeleteReserveService);

    await deleteReserveService.execute(new ObjectId(id));

    return response.status(HttpStatusCode.NoContent).json();
  }
}

export default DeleteReserveController;
