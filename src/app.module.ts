import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { FeatureModule } from './features/feature.module';
import { LinkService } from './features/link/link.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const loadDatabaseConfig: ConfigFactory = () => ({
	postgres: {
		host: process.env.HOST || 'localhost',
		port: 5432
	}
})

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: false,
			envFilePath: ['.env', '.env.dev', '.env.prod'],
			load: [loadDatabaseConfig]
		}),
		ScheduleModule.forRoot(),
		InfraModule,
		FeatureModule
	],
	controllers: [AppController],
	providers: [LinkService, AppService],
})
export class AppModule { }
