import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestRegister } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';
import { Authorize } from '../../common/decorators/authorization.decorator';
import { User } from '@prisma/client';
import { Authorized } from '../../common/decorators/authorized.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Get('ping')
	@HttpCode(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
	ping(@Req() req: Request) {
		return req.cookies
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async create(@Res({ passthrough: true }) res: Response, @Body() dto: RequestRegister) {
		return await this.authService.register(res, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginRequest) {
		return await this.authService.login(res, dto)
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return await this.authService.refresh(req, res)
	}

	@Get('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res)
	}


	@Authorize()
	@Get('@me')
	@HttpCode(HttpStatus.OK)
	async me(@Authorized() user: User) {
		return user
	}
}
