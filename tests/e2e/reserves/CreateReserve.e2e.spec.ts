import 'reflect-metadata';
import CreateCarService from '@modules/cars/services/CreateCarService';
import CreateReserveService from '@modules/reserves/services/CreateReserveService';
import CreateUserService from '@modules/users/services/CreateUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { container } from 'tsyringe';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import {
  CAR_NOT_FOUND,
  INVALID_START_OR_END_DATE,
  USER_ALREADY_HAVE_RESERVE,
  USER_DONT_QUALIFIED,
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

describe('CreateReserveController', () => {
  /*eslint-disable @typescript-eslint/no-unused-vars */
  let createUserService: CreateUserService;
  let createCarService: CreateCarService;
  let createReserveService: CreateReserveService;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';
  const reserveUrl = '/api/v1/reserve';

  beforeEach(async () => {
    createUserService = container.resolve(CreateUserService);
    createCarService = container.resolve(CreateCarService);
    createReserveService = container.resolve(CreateReserveService);
  });

  it('Should be able to create a new Reserve', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'yes',
    };

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

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.start_date).toEqual(createReservation.start_date);
    expect(response.body).toHaveProperty('final_value');
  });

  it('Should not be able to create a reserve if user does not exists', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'yes',
    };

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

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: USER_NOT_FOUND,
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: '668af1e3b9ea0673bc61fd9e',
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to create a reserve if user dont be qualified', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

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

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: USER_DONT_QUALIFIED,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to create a reserve if car does not exists', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'yes',
    };

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: '668af1e3b9ea0673bc61fd9e',
    };

    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to create a new Reserve if user already have a reserve', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'yes',
    };

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

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: USER_ALREADY_HAVE_RESERVE,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);
    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
  it('Should not be able to create a new Reserve if end_date is before start date', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'yes',
    };

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

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_START_OR_END_DATE,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const createReservation = {
      start_date: '10/08/2024',
      end_date: '01/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
