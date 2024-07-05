import 'reflect-metadata';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { HttpStatusResponse } from '@shared/enums/HttpStatusResponse';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorResponseMessageConsts';
import UpdateAccessoryCarService from '@modules/cars/services/UpdateAccessoryCarService';

beforeAll(async () => {
  await dataSource.initialize();
});

afterEach(async () => {
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateAccessoryCarController', () => {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let updateAccessoryCarService: UpdateAccessoryCarService;
  const userUrl = '/api/v1/user';
  const sessionUrl = '/api/v1/authenticate';
  const carUrl = '/api/v1/car';

  beforeEach(async () => {
    updateAccessoryCarService = container.resolve(UpdateAccessoryCarService);
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

  it('Should be able to update a specific accessory of an existing car', async () => {
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

    const accessory_id = carCreated.body.accessories[0]._id;

    const urlWithId = `${carUrl}/${carCreated.body._id}/accessories/${accessory_id}`;
    const updateAccessory = {
      description: 'Leather Seats',
    };

    const response = await supertest(app)
      .patch(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateAccessory);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.description).toEqual(updateAccessory.description);
  });

  it('Should not be able to update an accessory of a car that does not exist', async () => {
    const token = await createUserAndAuthenticate();

    const updateAccessory = {
      description: 'Leather Seats',
    };

    const urlWithId = `${carUrl}/6684313f7877c3e97bc98fc6/accessories/6684313f7877c3e97bc98fc6`;
    const expectedResponse = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: CAR_NOT_FOUND,
    };

    const response = await supertest(app)
      .patch(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(updateAccessory);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });
});
