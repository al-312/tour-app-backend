import request from 'supertest';
import { Test, type TestingModule } from '@nestjs/testing';

import { AppModule } from '@/app.module';

import type { App } from 'supertest/types';
import type { INestApplication } from '@nestjs/common';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should compile and boot successfully', () => {
    expect(app).toBeDefined();
  });

  it('/ (GET) - Welcome route', async () => {
    const response = (await request(app.getHttpServer() as unknown as App)
      .get('/')
      .expect(200)) as unknown as { body: Record<string, unknown> };

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Welcome to Tour App API');
    expect(response.body['data']).toEqual({
      message: 'Welcome to Tour App API',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
