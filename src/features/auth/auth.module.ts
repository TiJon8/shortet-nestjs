import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from 'src/common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
			global: true,
			secret: config.getOrThrow('JWT_SECRET'),
			signOptions: {
				algorithm: 'HS256',

			},
			verifyOptions: {
				algorithms: ['HS256'],
				ignoreExpiration: false,
			}
		}),
		inject: [ConfigService]
	}),
		PassportModule
	],
	controllers: [AuthController],
	providers: [AuthService, JWTStrategy],
	exports: [AuthService]
})
export class AuthModule { }
