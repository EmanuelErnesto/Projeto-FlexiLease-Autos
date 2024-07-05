import { Router } from 'express';
import CreateCarController from '../controllers/CreateCarController';
import { RequestDataValidator } from '@shared/infra/http/middlewares/RequestDataValidator.middleware';
import { CreateCarSchema } from '../joi/schemas/CreateCarSchema';
import isAuthenticated from '@shared/infra/http/middlewares/IsAuthenticated.middleware';
import { RequestParamsDataValidator } from '@shared/infra/http/middlewares/RequestParamsDataValidator.middleware';
import { ShowCarSchema } from '../joi/schemas/ShowCarSchema';
import DeleteCarController from '../controllers/DeleteCarController';
import ListCarController from '../controllers/ListCarController';
import { ListCarSchema } from '../joi/schemas/ListCarSchema';
import ShowCarController from '../controllers/ShowCarController';
import { RequestQueryDataValidator } from '@shared/infra/http/middlewares/RequestQueryDataValidator.middleware';
import { RequestUpdateEntityDataValidator } from '@shared/infra/http/middlewares/RequestUpdateEntityDataValidator.middleware';
import UpdateCarController from '../controllers/UpdateCarController';
import { UpdateCarSchema } from '../joi/schemas/UpdateCarSchema';
import UpdateCarAccessoryController from '../controllers/UpdateCarAccessoryController';
import { UpdateCarAccessorySchema } from '../joi/schemas/UpdateCarAccessorySchema';

const carRouter = Router();

const createCarController = new CreateCarController();
const listCarController = new ListCarController();
const showCarController = new ShowCarController();
const updateCarController = new UpdateCarController();
const updateCarAccessoryController = new UpdateCarAccessoryController();
const deleteCarController = new DeleteCarController();

carRouter.use(isAuthenticated);

carRouter.post(
  '/',
  RequestDataValidator(CreateCarSchema),
  createCarController.execute,
);

carRouter.get(
  '/',
  RequestQueryDataValidator(ListCarSchema),
  listCarController.execute,
);

carRouter.get(
  '/:id',
  RequestParamsDataValidator(ShowCarSchema),
  showCarController.execute,
);

carRouter.delete(
  '/:id',
  RequestParamsDataValidator(ShowCarSchema),
  deleteCarController.execute,
);

carRouter.put(
  '/:id',
  RequestUpdateEntityDataValidator(UpdateCarSchema),
  updateCarController.execute,
);

carRouter.patch(
  '/:car_id/accessories/:id',
  RequestUpdateEntityDataValidator(UpdateCarAccessorySchema),
  updateCarAccessoryController.execute,
);

export default carRouter;
