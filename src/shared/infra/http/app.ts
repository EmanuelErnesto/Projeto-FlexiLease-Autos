import 'reflect-metadata';
import '@shared/container/index';
import '@shared/infra/typeorm';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import { ErrorHandler } from './middlewares/ErrorHandler.middleware';
import { RouteNotFound } from './middlewares/RouteNotFound.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-output.json';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(ErrorHandler);
app.use(RouteNotFound);

export { app };
