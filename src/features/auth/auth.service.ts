import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestRegister } from './dto/register.dto';
import { hash, verify } from 'argon2'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtTokenPayload } from '../../common/interfaces/token.interface';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';
import { isDev } from '../../common/utils/node.env';
import { User } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

type FindUniqueArgs =
	| { email: string; id?: never }
	| { id: string; email?: never };


@Injectable()
export class AuthService {
	private readonly COOKIE_DOMAIN: string
	private readonly JWT_ACCESS_TTL: string
	private readonly JWT_REFRESH_TTL: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.COOKIE_DOMAIN = configService.getOrThrow('COOKIE_DOMAIN')
		this.JWT_ACCESS_TTL = configService.getOrThrow('JWT_ACCESS_TTL')
		this.JWT_REFRESH_TTL = configService.getOrThrow('JWT_REFRESH_TTL')
	}

	async register(res: Response, dto: RequestRegister) {
		const { username, email, password } = dto

		const isUserExist = await this.prisma.user.findUnique({
			where: {
				email
			},
			select: {
				id: true
			}
		})

		if (isUserExist) throw new ConflictException({ message: 'Invalid request' })

		const user = await this.prisma.user.create({
			data: {
				username,
				email,
				password: await hash(password, { hashLength: 128 })
			},
			select: {
				id: true
			}
		})

		return this.auth(res, user.id)
	}


	async login(res: Response, dto: LoginRequest) {
		const { email, password } = dto

		const user = await this.findUnique({ email })

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) throw new NotFoundException({ message: 'Not Found', status: 'AUTHENTICATION_INVALID_REQUEST', code: 'TC_16C3' })

		return this.auth(res, user.id)
	}

	async refresh(req: Request, res: Response) {
		const cookieRT = req.cookies['refreshToken']

		if (!cookieRT) throw new UnauthorizedException()

		const payload: IJwtTokenPayload = await this.jwtService.verifyAsync(cookieRT)

		if (payload) {
			const user = await this.findUnique({ id: payload.id })

			return this.auth(res, user.id)
		}
	}

	async logout(res: Response) {
		this.setCookie(res, 'refreshToken', new Date(0))
		return { result: 'success' }
	}


	async findUnique(arg: FindUniqueArgs): Promise<User> {

		const user = await this.prisma.user.findUnique({
			where: 'email' in arg
				? { email: arg.email }
				: { id: arg.id },
			select: {
				id: true,
				password: true,
				email: true,
				username: true,
				createdAt: true,
				updatedAt: true,
			}
		})

		if (!user) throw new NotFoundException({ message: 'User not found' }, {})

		return user
	}

	private auth(res: Response, id: string) {
		const { accessToken, refreshToken } = this.generateToken(id)

		this.setCookie(res, refreshToken, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

		return { accessToken }
	}

	private setCookie(res: Response, token: string, expires: Date) {
		res.cookie('refreshToken', token, {
			domain: this.COOKIE_DOMAIN,
			httpOnly: true,
			expires,
			secure: !isDev(this.configService),
			sameSite: isDev(this.configService) ? 'none' : 'lax'
		})
	}

	private generateToken(id: string) {
		const payload: IJwtTokenPayload = { id }

		const accessToken = this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_TTL })

		const refreshToken = this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_TTL })

		return { accessToken, refreshToken }
	}

	async validate(id: string) {
		const user = await this.findUnique({ id })

		return user
	}
}
