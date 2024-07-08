import { Router } from 'express';
import CreateReserveController from '../controllers/CreateReserveController';

import { RequestDataValidator } from '@shared/infra/http/middlewares/RequestDataValidator.middleware';
import isAuthenticated from '@shared/infra/http/middlewares/IsAuthenticated.middleware';
import ListReserveController from '../controllers/ListReserveController';
import ShowReserveController from '../controllers/ShowReserveController';
import UpdateReserveController from '../controllers/UpdateReserveController';
import DeleteReserveController from '../controllers/DeleteReserveController';
import { RequestParamsDataValidator } from '@shared/infra/http/middlewares/RequestParamsDataValidator.middleware';
import { CreateReserveSchema } from '../joi/schemas/CreateReserveSchema';
import { ListReserveSchema } from '../joi/schemas/ListReserveSchema';
import { ShowReserveSchema } from '../joi/schemas/ShowReserveSchema';
import { RequestUpdateEntityDataValidator } from '@shared/infra/http/middlewares/RequestUpdateEntityDataValidator.middleware';
import { UpdateReserveSchema } from '../joi/schemas/UpdateReserveSchema';

const reserveRouter = Router();

const createReserveController = new CreateReserveController();
const listReserveController = new ListReserveController();
const showReserveController = new ShowReserveController();
const updateReserveController = new UpdateReserveController();
const deleteReserveController = new DeleteReserveController();

reserveRouter.use(isAuthenticated);

reserveRouter.post(
  '/',
  RequestDataValidator(CreateReserveSchema),
  createReserveController.execute,
);

reserveRouter.get(
  '/',
  RequestParamsDataValidator(ListReserveSchema),
  listReserveController.execute,
);

reserveRouter.get(
  '/:id',
  RequestParamsDataValidator(ShowReserveSchema),
  showReserveController.execute,
);

reserveRouter.delete(
  '/:id',
  RequestParamsDataValidator(ShowReserveSchema),
  deleteReserveController.execute,
);

reserveRouter.put(
  '/:id',
  RequestUpdateEntityDataValidator(UpdateReserveSchema),
  updateReserveController.execute,
);

export default reserveRouter;
