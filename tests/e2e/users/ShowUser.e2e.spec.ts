import 'reflect-metadata';
import ShowUserService from '@modules/users/services/ShowUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { container } from 'tsyringe';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { USER_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';

beforeAll(async () => {
  await dataSource.initialize();
});
afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ShowUserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let showUserService: ShowUserService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    showUserService = container.resolve(ShowUserService);
  });

  it('Should be able to return a existent user', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const userCreated = await supertest(app).post(url).send(createUser);
    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });
    const token1 = sessionResponse.body.token;
    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .get(urlWithId)
      .set('Authorization', `Bearer ${token1}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body._id).toEqual(userCreated.body._id);
    expect(response.body.name).toEqual(createUser.name);
    expect(response.body.email).toEqual(createUser.email);
  });

  it('Should not be able to return a user that not exists', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };
    const urlWithId = url + '/' + '6684313f7877c3e97bc98fc6';
    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: USER_NOT_FOUND,
    };

    await supertest(app).post(url).send(createUser);
    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });
    const token = sessionResponse.body.token;

    const response = await supertest(app)
      .get(urlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
