import 'reflect-metadata';
import { dataSource } from 'src/shared/infra/typeorm/index';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import CreateUserService from '@modules/users/services/CreateUserService';
import { app } from '@shared/infra/http/app';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  INSUFFICIENT_AGE,
} from '@shared/consts/ErrorResponseMessageConsts';

beforeAll(async () => {
  await dataSource.initialize();
});
afterEach(async () => {
  await dataSource.dropDatabase();
});
afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateUserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let createUserService: CreateUserService;

  const url = '/api/v1/user';

  beforeEach(async () => {
    createUserService = container.resolve(CreateUserService);
  });
  it('Should be able to create a new User', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };
    const response = await supertest(app).post(url).send(createUser);

    expect(response.status).toEqual(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toEqual(createUser.name);
    expect(response.body.email).toEqual(createUser.email);
  });

  it('Should not be able to create a new User with a existent email', async () => {
    const createUser = {
      name: 'Josué Motoboy 2',
      cpf: '123.456.789-02',
      birth: '11/10/2003',
      email: 'josue@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };
    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: EMAIL_ALREADY_USED,
    };

    await supertest(app).post(url).send(createUser);

    const response = await supertest(app).post(url).send(createUser);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to create a new user with a age that is under 18 years', async () => {
    const createUser = {
      name: 'Carlinhos',
      cpf: '123.456.789-03',
      birth: '11/10/2010',
      email: 'carlinhoszerobala@example.com',
      password: 'senha123',
      cep: '55850000',
      qualified: 'no',
    };
    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INSUFFICIENT_AGE,
    };

    const response = await supertest(app).post(url).send(createUser);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to create a new user with a existent cpf in database', async () => {
    const createUser = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: 'anamaria@example.com',
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const createUser2 = {
      name: 'Josefina',
      cpf: '123.456.789-10',
      birth: '25/12/2000',
      email: 'josefina@example.com',
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: CPF_ALREADY_USED,
    };

    await supertest(app).post(url).send(createUser);
    const response = await supertest(app).post(url).send(createUser2);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
