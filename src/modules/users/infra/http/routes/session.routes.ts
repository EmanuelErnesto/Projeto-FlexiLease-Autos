import { Router } from 'express';
import SessionController from '../controllers/CreateSessionController';
import { RequestDataValidator } from '@shared/infra/http/middlewares/RequestDataValidator.middleware';
import { CreateSessionSchema } from '../joi/schemas/CreateSessionSchema';

const sessionsRouter = Router();
const sessionsController = new SessionController();

sessionsRouter.post(
  '/',
  RequestDataValidator(CreateSessionSchema),
  sessionsController.execute,
);

export default sessionsRouter;
