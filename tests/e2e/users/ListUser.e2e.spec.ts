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
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars*/
  let listUserService: ListUserService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    listUserService = container.resolve(ListUserService);
  });

  const createUserAndAuthenticate = async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    await supertest(app).post(url).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    return sessionResponse.body.token;
  };

  it('should be able to return a list of Users', async () => {
    const token = await createUserAndAuthenticate();
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
      birth: '1996-12-10',
      email: 'anamaria@example.com',
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);
    await supertest(app).post(url).send(createUser2);
    const response = await supertest(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(1);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
  });

  it('should return users filtered by name', async () => {
    const token = await createUserAndAuthenticate();

    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: 'chinatown@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app)
      .get(url)
      .query({ name: 'Chinatown' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it('should return users filtered by birth date', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: 'chinatown@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app)
      .get(url)
      .query({ birth: '10/05/2000' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(0);
  });
  it('should return users filtered by CEP', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: 'chinatown@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app)
      .get(url)
      .query({ cep: '55850000' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it('should return users filtered by qualification', async () => {
    const token = await createUserAndAuthenticate();
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
      name: 'Chinatown 2',
      cpf: '123.456.789-30',
      birth: '10/05/2001',
      email: 'chinatown2@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'no',
    };

    await supertest(app).post(url).send(createUser);
    await supertest(app).post(url).send(createUser2);

    const response = await supertest(app)
      .get(url)
      .query({ qualified: 'yes' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body.users.length).toEqual(1);
  });
});
