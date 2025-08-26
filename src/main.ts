import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { CustomLogger } from './common/logger/logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new CustomLogger({
			prefix: undefined,
			colors: true,
		}),
		bufferLogs: true
	});

	app.useGlobalPipes(new ValidationPipe())


	app.enableCors({

	})

	// app.setGlobalPrefix('service')

	app.enableVersioning({
		type: VersioningType.HEADER,
		// prefix: 'v',
		header: 'X-Version-Service',

		defaultVersion: '1'
	})
	await app.listen(3015);
}
bootstrap();
