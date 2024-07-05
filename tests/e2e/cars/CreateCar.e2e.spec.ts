import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import CreateUserService from '@modules/users/services/CreateUserService';
import { app } from '@shared/infra/http/app';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import {
  INSUFFICIENT_ACCESSORY,
  INVALID_ACCESSORY,
} from '@shared/consts/ErrorResponseMessageConsts';
import CreateCarService from '@modules/cars/services/CreateCarService';

beforeAll(async () => {
  await dataSource.initialize();
});

afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateCarController', () => {
  /*eslint-disable @typescript-eslint/no-unused-vars */
  let createUserService: CreateUserService;
  let createCarService: CreateCarService;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';

  beforeEach(async () => {
    createUserService = container.resolve(CreateUserService);
    createCarService = container.resolve(CreateCarService);
  });

  it('Should be able to create a new Car', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2022,
      value_per_day: 100,
      accessories: [
        { description: 'Air Conditioning' },
        { description: 'Sunroof' },
      ],
      number_of_passengers: 5,
    };

    const response = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    expect(response.status).toEqual(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty('model');
    expect(response.body.model).toEqual(createCar.model);
    expect(response.body.color).toEqual(createCar.color);
    expect(response.body.accessories.length).toEqual(2);
  });

  it('Should not be able to create a new Car with invalid accessories', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2022,
      value_per_day: 100,
      accessories: [
        { description: 'Air Conditioning' },
        { description: 'Air Conditioning' },
      ],
      number_of_passengers: 5,
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_ACCESSORY,
    };

    const response = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to create a new Car with insufficient accessories', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2022,
      value_per_day: 100,
      accessories: [],
      number_of_passengers: 5,
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INSUFFICIENT_ACCESSORY,
    };

    const response = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
