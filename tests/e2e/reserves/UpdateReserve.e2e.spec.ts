import 'reflect-metadata';
import CreateCarService from '@modules/cars/services/CreateCarService';
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
  RESERVE_NOT_FOUND,
  USER_ALREADY_HAVE_RESERVE,
  USER_DONT_QUALIFIED,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorResponseMessageConsts';
import CreateReserveService from '@modules/reserves/services/CreateReserveService';
import UpdateReserveService from '@modules/reserves/services/UpdateReserveService';

beforeAll(async () => {
  await dataSource.initialize();
});

afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateReserveController', () => {
  /*eslint-disable @typescript-eslint/no-unused-vars */
  let createUserService: CreateUserService;
  let createCarService: CreateCarService;
  let createReserveService: CreateReserveService;
  let updateReserveService: UpdateReserveService;
  let authToken: string;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';
  const reserveUrl = '/api/v1/reserve';

  beforeEach(async () => {
    createUserService = container.resolve(CreateUserService);
    createCarService = container.resolve(CreateCarService);
    createReserveService = container.resolve(CreateReserveService);
    updateReserveService = container.resolve(UpdateReserveService);
    authToken = await createUserAndAuthenticate();
  });
  const createUserAndAuthenticate = async () => {
    const createUser = {
      name: 'User for token',
      cpf: '123.456.790-60',
      birth: '10/05/2004',
      email: `tokenuser${Date.now()}@example.com`,
      password: 'tokenpassword',
      cep: '01001000',
      qualified: 'no',
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    return sessionResponse.body.token;
  };
  it('Should be able to update an existing Reserve', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.890-00',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const CreateReservation2 = {
      start_date: '20/08/2024',
      end_date: '30/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(CreateReservation2);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.start_date).toEqual(CreateReservation2.start_date);
    expect(response.body.end_date).toEqual(CreateReservation2.end_date);
    expect(response.body).toHaveProperty('final_value');
  });
  it('Should not be able to update a reserve if user does not exist', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.780-00',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const CreateReservation = {
      start_date: '05/08/2024',
      end_date: '15/08/2024',
      id_user: '668af1e3b9ea0673bc61fd9e',
      id_car: createdCar.body._id,
    };

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: USER_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(CreateReservation);
    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a reserve if user is not qualified', async () => {
    const createUser = {
      name: 'Usuario teste',
      cpf: '125.348.780-00',
      birth: '10/05/2000',
      email: `mago${Date.now()}@example.com`,
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

    const CreateUser2 = {
      name: 'John Doe',
      cpf: '123.456.789-80',
      birth: '10/05/2000',
      email: `johndoe-${Date.now()}@example.com`,
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: USER_DONT_QUALIFIED,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);
    const createdUser2 = await supertest(app).post(userUrl).send(CreateUser2);

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const updateReservation = {
      start_date: '05/08/2024',
      end_date: '15/08/2024',
      id_user: createdUser2.body._id,
      id_car: createdCar.body._id,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a reserve if car does not exist', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '128.456.789-00',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const updateReservation = {
      start_date: '05/08/2024',
      end_date: '15/08/2024',
      id_user: createdUser.body._id,
      id_car: '668af1e3b9ea0673bc61fd9e',
    };

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateReservation);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a reserve with invalid start or end date', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.457.789-00',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const updateReservation = {
      start_date: '18/08/2024',
      end_date: '12/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_START_OR_END_DATE,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a reserve if user already has a reserve in period', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-02',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createCar2 = {
      model: 'Model S V2',
      color: 'White',
      year: 2023,
      value_per_day: 200,
      accessories: [
        { description: 'Air Conditioning' },
        { description: 'Sunroof' },
      ],
      number_of_passengers: 4,
    };

    const createdUser = await supertest(app).post(userUrl).send(createUser);

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const createdCar2 = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar2);

    const createReservation = {
      start_date: '01/08/2024',
      end_date: '10/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const reservationResponse = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const updateReservation = {
      start_date: '05/08/2024',
      end_date: '15/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar2.body._id,
    };

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createReservation);

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: USER_ALREADY_HAVE_RESERVE,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/${reservationResponse.body._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateReservation);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a reserve if reserve does not exist', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-06',
      birth: '10/05/2000',
      email: `josue${Date.now()}@example.com`,
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

    const createdCar = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCar);

    const updateReservation = {
      start_date: '05/08/2024',
      end_date: '15/08/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: RESERVE_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${reserveUrl}/668af1e3b9ea0673bc61fd9e`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateReservation);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
