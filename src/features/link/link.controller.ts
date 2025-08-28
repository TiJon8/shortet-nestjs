import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Version } from '@nestjs/common';
import { LinkService } from './link.service';
import { RequestCreateLink } from './dto';
import { Authorized } from '../../common/decorators/authorized.decorator';
import { Authorize } from '../../common/decorators/authorization.decorator';

@Authorize()
@Controller({
	path: 'link',
	// version: '1',
})
export class LinkController {
	constructor(private readonly linkService: LinkService) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() dto: RequestCreateLink, @Authorized('id') id: string) {
		return this.linkService.create(dto.original, id)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	delete(@Param('id') id: string) {
		return this.linkService.delete(id)
	}

	// @Version('1')
	@Get()
	ping() {
		console.log('yes')
		return 'pong'
	}
}
