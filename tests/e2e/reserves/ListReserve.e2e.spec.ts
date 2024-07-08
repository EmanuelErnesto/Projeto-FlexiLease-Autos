import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListReserveService from '@modules/reserves/services/ListReserveService';

beforeAll(async () => {
  await dataSource.initialize();
});

afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ListReserveController', () => {
  /*eslint-disable */
  let listReserveService: ListReserveService;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';
  const reserveUrl = '/api/v1/reserve';

  beforeEach(async () => {
    listReserveService = container.resolve(ListReserveService);
  });

  it('Should be able to return a list of reserves', async () => {
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

    const createReservation2 = {
      start_date: '07/01/2025',
      end_date: '10/02/2025',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const createdReserve1 = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    const createdReserve2 = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation2);

    const response = await supertest(app)
      .get(reserveUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty('reserves');
    expect(response.body.reserves[0].start_date).toEqual(
      createdReserve1.body.start_date,
    );
    expect(response.body.reserves[0].end_date).toEqual(
      createdReserve1.body.end_date,
    );
    expect(response.body.reserves[1].final_value).toEqual(
      createdReserve2.body.final_value,
    );
  });
  
  it('Should be able to return a list of reserves filtered by start_date', async () => {
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
      start_date: '01/10/2024',
      end_date: '10/10/2024',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    const createReservation2 = {
      start_date: '07/01/2025',
      end_date: '10/02/2025',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation2);

    const response = await supertest(app)
      .get(`${reserveUrl}?start_date=01/10/2024`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(
      response.body.reserves.every(
        (        reserve: { start_date: string; }) => reserve.start_date === '01/10/2024',
      ),
    );
  });
  it('Should be able to return a list of reserves filtered by end_date', async () => {
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
      model: 'ModelS',
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

    const createReservation2 = {
      start_date: '07/01/2025',
      end_date: '10/02/2025',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
    };

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation2);

    const response = await supertest(app)
      .get(`${reserveUrl}?end_date=10/02/2025`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(
      response.body.reserves.every(
        (        reserve: { end_date: string; }) => reserve.end_date === '10/02/2025',
      ),
    ).toBe(true);
  });
  it('Should be able to return a list of reserves filtered by final_value', async () => {
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
      final_value: 900,
    };

    const createReservation2 = {
      start_date: '07/01/2025',
      end_date: '10/02/2025',
      id_user: createdUser.body._id,
      id_car: createdCar.body._id,
      final_value: 1500,
    };

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation2);

    const response = await supertest(app)
      .get(`${reserveUrl}?final_value=1500`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(
      response.body.reserves.every((reserve: { final_value: number; }) => reserve.final_value === 1500),
    ).toBe(true);
  });
});
