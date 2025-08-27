import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
// 	let app: INestApplication<App>;

// 	beforeEach(async () => {
// 		const moduleFixture: TestingModule = await Test.createTestingModule({
// 			imports: [AppModule],
// 		}).compile();

// 		app = moduleFixture.createNestApplication();
// 		await app.init();
// 	});

// 	it('/link (POST) - should create link', async () => {
// 		const response = await request(app.getHttpServer())
// 			.post('/link')
// 			.expect({ original: "https://stockmann.ru/product/5280216-det-futbolka-s-dlinnym-rukavom/" })
// 			.expect(201)

// 		expect(response.body).toMatchObject({url: })

// 		return request(app.getHttpServer())
// 			.get('/')
// 			.expect(200)
// 			.expect('Hello World!');
// 	});
// });
