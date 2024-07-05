import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  OLD_PASSWORD_DONT_MATCH,
  OLD_PASSWORD_REQUIRED,
  USER_NOT_FOUND,
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

describe('UpdateUserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let updateUserService: UpdateUserService;
  const url = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    updateUserService = container.resolve(UpdateUserService);
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

  it('Should be able to update a existent user', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const updateUser = {
      name: 'Ana Maria',
      cpf: '123.456.789-60',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      old_password: 'senha123',
      password: 'novasenha',
      password_confirmation: 'novasenha',
      cep: '01001000',
      qualified: 'yes',
    };

    const userCreated = await supertest(app).post(url).send(createUser);

    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .put(urlWithId)
      .send(updateUser)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body._id).toEqual(userCreated.body._id);
    expect(response.body.name).toEqual(updateUser.name);
    expect(response.body.email).toEqual(updateUser.email);
  });

  it('Should not be able to update a user that not exists', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };
    const updateUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
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

    const response = await supertest(app)
      .put(urlWithId)
      .send(updateUser)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to update a user with a existent email', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const createUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const updateUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      cep: '01001000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: EMAIL_ALREADY_USED,
    };

    await supertest(app).post(url).send(createUser);

    const userCreated = await supertest(app).post(url).send(createUser2);

    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .put(urlWithId)
      .send({
        ...updateUser2,
        email: createUser.email,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to update a user password without old password', async () => {
    const token = await createUserAndAuthenticate();
    const createUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const updateUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      cep: '01001000',
      password: 'senha1234',
      password_confirmation: 'senha1234',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: OLD_PASSWORD_REQUIRED,
    };

    const userCreated = await supertest(app).post(url).send(createUser2);

    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .put(urlWithId)
      .send(updateUser2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to update a user password if old password does not match with the password registered', async () => {
    const token = await createUserAndAuthenticate();
    const createUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const updateUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      cep: '01001000',
      password: 'senha1234',
      password_confirmation: 'senha1234',
      old_password: 'senhainvalida',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: OLD_PASSWORD_DONT_MATCH,
    };

    const userCreated = await supertest(app).post(url).send(createUser2);

    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .put(urlWithId)
      .send(updateUser2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to update a user with a existent cpf', async () => {
    const token = await createUserAndAuthenticate();
    const createUser = {
      name: 'Chinatown',
      cpf: '123.456.789-20',
      birth: '10/05/2000',
      email: `chinatown${Date.now()}@example.com`,
      password: 'senha123',
      cep: '55850000',
      qualified: 'yes',
    };

    const createUser2 = {
      name: 'Ana Maria',
      cpf: '123.456.789-10',
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      password: 'senha1234',
      cep: '01001000',
      qualified: 'yes',
    };

    const updateUser2 = {
      name: 'Ana Maria',
      cpf: createUser.cpf,
      birth: '10/12/1996',
      email: `anamaria${Date.now()}@example.com`,
      cep: '01001000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: CPF_ALREADY_USED,
    };

    await supertest(app).post(url).send(createUser);

    const userCreated = await supertest(app).post(url).send(createUser2);

    const urlWithId = url + '/' + `${userCreated.body._id}`;

    const response = await supertest(app)
      .put(urlWithId)
      .send(updateUser2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
