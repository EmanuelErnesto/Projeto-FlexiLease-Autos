import carRouter from '@modules/cars/infra/http/routes/car.routers';
import sessionsRouter from '@modules/users/infra/http/routes/session.routes';
import userRouter from '@modules/users/infra/http/routes/user.routers';
import { Router } from 'express';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/authenticate', sessionsRouter);
routes.use('/car', carRouter);

export default routes;
