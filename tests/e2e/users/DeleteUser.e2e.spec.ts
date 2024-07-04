import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
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

describe('DeleteUserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let deleteUserService: DeleteUserService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    deleteUserService = container.resolve(DeleteUserService);
  });

  it('Should be able to delete a existent user', async () => {
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
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token1}`);

    expect(response.status).toEqual(HttpStatusCode.NO_CONTENT);
  });

  it('Should not be able to delete a user that not exists', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: USER_NOT_FOUND,
    };

    const userCreated = await supertest(app).post(url).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;
    const urlWithId = url + '/' + `${userCreated.body._id}`;

    await supertest(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`);
    const response = await supertest(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
