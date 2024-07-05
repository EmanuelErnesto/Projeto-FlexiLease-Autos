import 'reflect-metadata';
import ShowCarService from '@modules/cars/services/ShowCarService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { container } from 'tsyringe';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';

beforeAll(async () => {
  await dataSource.initialize();
});
afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ShowCarController', () => {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let showCarService: ShowCarService;
  const url = '/api/v1/car';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    showCarService = container.resolve(ShowCarService);
  });

  it('Should be able to return an existent car', async () => {
    const createUser = {
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/2000',
      email: `testuser${Date.now()}@example.com`,
      password: 'password123',
      cep: '12345678',
      qualified: 'yes',
    };

    await supertest(app).post('/api/v1/user').send(createUser);

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

    const carCreated = await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const urlWithId = `${url}/${carCreated.body._id}`;

    const response = await supertest(app)
      .get(urlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body._id).toEqual(carCreated.body._id);
    expect(response.body.model).toEqual(createCar.model);
    expect(response.body.color).toEqual(createCar.color);
  });

  it('Should not be able to return a car that does not exist', async () => {
    const createUser = {
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/2000',
      email: `testuser${Date.now()}@example.com`,
      password: 'password123',
      cep: '12345678',
      qualified: 'yes',
    };

    await supertest(app).post('/api/v1/user').send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;
    const nonExistentId = '6684313f7877c3e97bc98fc6';
    const urlWithId = `${url}/${nonExistentId}`;

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const response = await supertest(app)
      .get(urlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
