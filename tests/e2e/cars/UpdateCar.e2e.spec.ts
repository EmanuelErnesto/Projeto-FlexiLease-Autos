import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import UpdateCarService from '@modules/cars/services/UpdateCarService';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import {
  CAR_NOT_FOUND,
  INSUFFICIENT_ACCESSORY,
  INVALID_ACCESSORY,
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

describe('UpdateCarController', () => {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let updateCarService: UpdateCarService;
  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';

  beforeEach(async () => {
    updateCarService = container.resolve(UpdateCarService);
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

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    return sessionResponse.body.token;
  };

  it('Should be able to update an existing car', async () => {
    const token = await createUserAndAuthenticate();

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const carCreated = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const urlWithId = `${carUrl}/${carCreated.body._id}`;

    const updateCar = {
      model: 'Model X',
      color: 'Black',
      year: 2021,
      value_per_day: 150,
      accessories: [
        {
          _id: carCreated.body.accessories[0]._id,
          description: 'Leather Seats',
        },
      ],
      number_of_passengers: 6,
    };

    const response = await supertest(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateCar);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body._id).toEqual(carCreated.body._id);
    expect(response.body.model).toEqual(updateCar.model);
    expect(response.body.color).toEqual(updateCar.color);
    expect(response.body.year).toEqual(updateCar.year);
    expect(response.body.value_per_day).toEqual(updateCar.value_per_day);
    expect(response.body.accessories[0].description).toEqual(
      updateCar.accessories[0].description,
    );
    expect(response.body.number_of_passengers).toEqual(
      updateCar.number_of_passengers,
    );
  });

  it('Should not be able to update a car that does not exist', async () => {
    const token = await createUserAndAuthenticate();

    const updateCar = {
      model: 'Model X',
      color: 'Black',
      year: 2021,
      value_per_day: 150,
      accessories: [
        { _id: '6684313f7877c3e97bc98fc6', description: 'Leather Seats' },
      ],
      number_of_passengers: 6,
    };

    const urlWithId = `${carUrl}/6684313f7877c3e97bc98fc6`;
    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateCar);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a car with insufficient accessories', async () => {
    const token = await createUserAndAuthenticate();

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const carCreated = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const updateCar = {
      model: 'Model X',
      color: 'Black',
      year: 2021,
      value_per_day: 150,
      accessories: [],
      number_of_passengers: 6,
    };

    const urlWithId = `${carUrl}/${carCreated.body._id}`;

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INSUFFICIENT_ACCESSORY,
    };

    const response = await supertest(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateCar);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it('Should not be able to update a car with duplicated accessories', async () => {
    const token = await createUserAndAuthenticate();

    const createCar = {
      model: 'Model S',
      color: 'Red',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const carCreated = await supertest(app)
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const updateCar = {
      model: 'Model X',
      color: 'Black',
      year: 2021,
      value_per_day: 150,
      accessories: [
        {
          _id: carCreated.body.accessories[0]._id,
          description: 'Leather Seats',
        },
        {
          _id: carCreated.body.accessories[0]._id,
          description: 'Leather Seats',
        },
      ],
      number_of_passengers: 6,
    };

    const urlWithId = `${carUrl}/${carCreated.body._id}`;

    const expectedResponse = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_ACCESSORY,
    };

    const response = await supertest(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateCar);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
