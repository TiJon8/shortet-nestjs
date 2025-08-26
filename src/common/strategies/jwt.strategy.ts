import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "src/features/auth/auth.service";
import { IJwtTokenPayload } from "src/common/interfaces/token.interface";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
		})
	};

	async validate(payload: IJwtTokenPayload) {
		return await this.authService.validate(payload.id)
		// console.log('Из стратегии', u)
		// return u
	}
}