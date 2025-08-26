import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { LinkService } from './features/link/link.service';
import { Response } from 'express';
import { IpProperty, UserAgent } from './common/decorators/http.decorator';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private link: LinkService) { }

	@Get(':code')
	async getLink(
		@Param('code') code: string,
		@Res({ passthrough: true }) response: Response,
		@IpProperty() ip: string,
		@UserAgent() ua: string,
	) {
		console.log(ip)
		console.log(typeof ua)
		const link = await this.link.getLinkByCode(code)

		await this.link.trackClick(link.shortCode, ip, ua)

		return response.redirect(link.originalLink)
	}
}
