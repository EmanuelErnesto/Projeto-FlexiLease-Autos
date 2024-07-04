import 'reflect-metadata';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { container } from 'tsyringe';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { INCORRECT_COMBINATION } from '@shared/consts/ErrorResponseMessageConsts';

beforeAll(async () => {
  await dataSource.initialize();
});
afterEach(async () => {
  await dataSource.dropDatabase();
});
afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateSessionController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let createSessionService: CreateSessionsService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    createSessionService = container.resolve(CreateSessionsService);
  });

  it('Should be able to create a new Session', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-40',
      birth: '10/05/2000',
      email: `${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to create a session with incorrect email', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-40',
      birth: '10/05/2000',
      email: `${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INCORRECT_COMBINATION,
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app)
      .post(sessionUrl)
      .send({
        email: `januario${Date.now()}@example.com`,
        password: createUser.password,
      });

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to create a session with incorrect password', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-40',
      birth: '10/05/2000',
      email: `${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INCORRECT_COMBINATION,
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app)
      .post(sessionUrl)
      .send({
        email: createUser.email,
        password: `${Date.now()}`,
      });

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
