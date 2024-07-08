import 'reflect-metadata';

import { dataSource } from '@shared/infra/typeorm';
import DeleteReserveService from '@modules/reserves/services/DeleteReserveService';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';

beforeAll(async () => {
  await dataSource.initialize();
});

afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('DeleteReserveController', () => {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let deleteReserveService: DeleteReserveService;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';
  const reserveUrl = '/api/v1/reserve';

  beforeEach(async () => {
    deleteReserveService = container.resolve(DeleteReserveService);
  });

  it('Should be able to delete a existent Reserve', async () => {
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

    const createdReserve = await supertest(app)
      .post(reserveUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createReservation);

    const response = await supertest(app)
      .delete(reserveUrl + '/' + createdReserve.body._id)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NO_CONTENT);
    expect(response.body).not.toHaveProperty('_id');
  });
  it('Should not be able to delete a reserve that does not exists', async () => {
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
      message: RESERVE_NOT_FOUND,
    };

    await supertest(app).post(userUrl).send(createUser);

    const sessionResponse = await supertest(app).post(sessionUrl).send({
      email: createUser.email,
      password: createUser.password,
    });

    const token = sessionResponse.body.token;

    const response = await supertest(app)
      .delete(reserveUrl + '/' + '668af1e3b9ea0673bc61fd9e')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
