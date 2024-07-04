import { Router } from 'express';
import CreateUserController from '../controllers/CreateUserController';
import { RequestDataValidator } from '@shared/infra/http/middlewares/RequestDataValidator.middleware';
import { CreateUserSchema } from '../joi/schemas/CreateUserSchema';
import isAuthenticated from '@shared/infra/http/middlewares/IsAuthenticated.middleware';
import ListUserController from '../controllers/ListUserController';
import ShowUserController from '../controllers/ShowUserController';
import DeleteUserController from '../controllers/DeleteUserController';
import { RequestParamsDataValidator } from '@shared/infra/http/middlewares/RequestParamsDataValidator.middleware';
import { ShowUserSchema } from '../joi/schemas/ShowUserSchema';
import UpdateUserController from '../controllers/UpdateUserController';
import { RequestUpdateUserDataValidator } from '@shared/infra/http/middlewares/RequestUpdateUserDataValidator.middleware';
import { UpdateUserSchema } from '../joi/schemas/UpdateUserSchema';
import { ListUserSchema } from '../joi/schemas/ListUserSchema';

const userRouter = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

userRouter.post(
  '/',
  RequestDataValidator(CreateUserSchema),
  createUserController.execute,
);

userRouter.get(
  '/',
  isAuthenticated,
  RequestParamsDataValidator(ListUserSchema),
  listUserController.execute,
);

userRouter.get(
  '/:id',
  isAuthenticated,
  RequestParamsDataValidator(ShowUserSchema),
  showUserController.execute,
);

userRouter.delete(
  '/:id',
  isAuthenticated,
  RequestParamsDataValidator(ShowUserSchema),
  deleteUserController.execute,
);

userRouter.put(
  '/:id',
  isAuthenticated,
  RequestUpdateUserDataValidator(UpdateUserSchema),
  updateUserController.execute,
);

export default userRouter;
