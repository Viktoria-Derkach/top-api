import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types, disconnect } from 'mongoose';
import { CreateTopPageDto } from '../src/top-page/dto/create-top-page.dto';
import { TopLevelCategory } from '../src/top-page/top-page.model';
import { TOP_PAGE_NOT_FOUND_ERROR } from '../src/top-page/top-page.constants';

const testDto: CreateTopPageDto = {
  firstLevelCategory: TopLevelCategory.Books,
  secondCategory: 'react',
  alias: `algo ${Math.random()}`,
  title: 'react course',
  category: 'react',
  hh: {
    count: 3,
    juniorSalary: 300,
    middleSalary: 1500,
    seniorSalary: 4000,
  },
  advantages: [
    {
      title: 'coll',
      description: 'Cool description',
    },
  ],
  seoText: 'text',
  tagsTitle: 'mamamia',
  tags: ['moew'],
};

describe('TopPageController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/top-page/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/top-page/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .send({ ...testDto, firstLevelCategory: 'sdsd' })
      .expect(400);
  });

  it('/top-page/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .send({ ...testDto, secondCategory: 0 })
      .expect(400);
  });

  it('/top-page (PATCH) - success', () => {
    return request(app.getHttpServer())
      .patch('/top-page/' + createdId)
      .send({ ...testDto, title: 'hi' })
      .expect(200);
  });

  it('/top-page (PATCH) - fail', () => {
    return request(app.getHttpServer())
      .patch('/top-page/' + createdId)
      .send({ ...testDto, firstLevelCategory: 'hi' })
      .expect(400);
  });

  it('/top-page/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + createdId)
      .expect(200);
  });

  it('/top-page/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + new Types.ObjectId().toHexString())
      .expect(404, {
        statusCode: 404,
        message: TOP_PAGE_NOT_FOUND_ERROR,
        error: 'Not Found',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
