import 'reflect-metadata';
import ListUserService from '@modules/users/services/ListUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { container } from 'tsyringe';

beforeAll(async () => {
  await dataSource.initialize();
});
afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ListUserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let listUserService: ListUserService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    listUserService = container.resolve(ListUserService);
  });

  it('Should be able to return a list of Users', async () => {
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: 'chinatown@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const createUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: 'anamaria@example.com',
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);
    await supertest(app).post(url).send(createUser2);
    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const response = await supertest(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(1);
  });
});
