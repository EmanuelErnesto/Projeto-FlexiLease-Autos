import 'reflect-metadata';
import ListCarService from '@modules/cars/services/ListCarService';
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

describe('ListCarController', () => {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let listCarService: ListCarService;
  const url = '/api/v1/car';
  const sessionUrl = '/api/v1/authenticate';

  beforeEach(async () => {
    listCarService = container.resolve(ListCarService);
  });

  it('Should be able to return a list of Cars without any search parameters', async () => {
    const createUser = {
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/2000',
      email: 'testuser@example.com',
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

    const createCar1 = {
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
      model: 'Model X',
      color: 'Blue',
      year: 2021,
      value_per_day: 150,
      accessories: [
        { description: 'Heated Seats' },
        { description: 'Bluetooth' },
      ],
      number_of_passengers: 7,
    };

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar1);

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar2);

    const response = await supertest(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.cars.length).toBeGreaterThan(1);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
  });

  it('Should be able to return a list of Cars with search parameter "model"', async () => {
    const createUser = {
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/2000',
      email: 'testuser@example.com',
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

    const createCar1 = {
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
      model: 'Model X',
      color: 'Blue',
      year: 2021,
      value_per_day: 150,
      accessories: [
        { description: 'Heated Seats' },
        { description: 'Bluetooth' },
      ],
      number_of_passengers: 7,
    };

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar1);

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar2);

    const response = await supertest(app)
      .get(`${url}?model=Model S`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.cars.length).toBe(1);
    expect(response.body.cars[0].model).toEqual('Model S');
  });

  it('Should be able to return a list of Cars with search parameter "number_of_passengers"', async () => {
    const createUser = {
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/2000',
      email: 'testuser@example.com',
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

    const createCar1 = {
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
      model: 'Model X',
      color: 'Blue',
      year: 2021,
      value_per_day: 150,
      accessories: [
        { description: 'Heated Seats' },
        { description: 'Bluetooth' },
      ],
      number_of_passengers: 7,
    };

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar1);

    await supertest(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar2);

    const response = await supertest(app)
      .get(`${url}?number_of_passengers=7`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.cars.length).toBe(1);
    expect(response.body.cars[0].number_of_passengers).toEqual(7);
  });
});
