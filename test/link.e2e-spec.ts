import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/infra/prisma/prisma.service';
import { Authorize } from '../src/common/decorators/authorization.decorator';
import { AuthService } from '../src/features/auth/auth.service';

const mockLinkDTO = {
	original: 'http://example.com/video?w=source'
}

const mockUserAuth = {
	id: '37aa06e0-46ef-433d-9e32-5d1cdabcf34e'
}

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;
	let prisma: PrismaService;
	let authService: AuthService
	let token: string

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe())
		prisma = app.get(PrismaService)

		authService = app.get(AuthService)

		await app.init();
	});

	afterAll(async () => {
		// await prisma.link.deleteMany()
		await app.close()
	})

	it('/auth/login (POST) → получаем JWT', async () => {
		const res = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'my@mail.ru', password: 'hello_world' })
			.expect(200);

		// если у тебя auth возвращает json с токеном
		token = res.body.accessToken;

		// или если в куке
		// const cookie = res.headers['set-cookie'][0];
	});

	it('/ (POST)', async () => {
		const response = await request(app.getHttpServer())
			.post('/link')
			.set('Authorization', `Bearer ${token}`)
			.send(mockLinkDTO)
			.expect(201)

		expect(response.body).toHaveProperty('url')
	});
});
