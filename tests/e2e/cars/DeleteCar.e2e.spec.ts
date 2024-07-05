import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateCarService from '@modules/cars/services/CreateCarService';
import DeleteCarService from '@modules/cars/services/DeleteCarService';
import { app } from '@shared/infra/http/app';
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

describe('DeleteCarController', () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  let createUserService: CreateUserService;
  let createCarService: CreateCarService;
  let deleteCarService: DeleteCarService;

  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';

  beforeEach(async () => {
    createUserService = container.resolve(CreateUserService);
    createCarService = container.resolve(CreateCarService);
    deleteCarService = container.resolve(DeleteCarService);
  });

  it('Should be able to delete an existing Car', async () => {
    const createUser = {
      name: 'Josué Motoboy',
      cpf: '123.456.789-00',
      birth: '10/05/2000',
      email: 'josue123@example.com',
      password: 'senha123',
      cep: '01001000',
      qualified: 'no',
    };

    const userCreated = await supertest(app).post(userUrl).send(createUser);

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
      .post(carUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(createCar);

    const carId = carCreated.body._id;
    const deleteCarUrlWithId = `${carUrl}/${carId}`;

    const response = await supertest(app)
      .delete(deleteCarUrlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NO_CONTENT);
  });

  it('Should not be able to delete a car that does not exist', async () => {
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

    const nonExistentCarId = '60c72b2f9b1d8e4b88d35489';
    const deleteCarUrlWithId = `${carUrl}/${nonExistentCarId}`;

    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const response = await supertest(app)
      .delete(deleteCarUrlWithId)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
