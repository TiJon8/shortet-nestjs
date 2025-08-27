import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../infra/prisma/prisma.service'; // path for jest

@Injectable()
export class LinkService {
	constructor(private readonly prisma: PrismaService, private config: ConfigService) { }

	async create(original: string, id: string) {
		const shortCode = randomBytes(5).toString('hex')

		const link = await this.prisma.link.create({
			data: {
				originalLink: original,
				shortCode,
				user: {
					connect: {
						id
					}
				}
			}
		})

		const shortLink = `${this.config.getOrThrow<string>('BASE_URL')}/${link.shortCode}`

		return { url: shortLink }
	}

	async getLinkByCode(code: string) {
		const link = await this.prisma.link.findUnique({
			where: {
				shortCode: code
			}
		})

		if (!link) throw new NotFoundException()

		return link
	}

	async trackClick(code: string, ip: string, userAgent: string) {
		const link = await this.getLinkByCode(code)

		const click = await this.prisma.click.create({
			data: {
				ip: ip,
				userAgent: userAgent,
				link: {
					connect: {
						id: link.id
					}
				}
			}
		})
	}

	async delete(id: string) {
		const link = await this.prisma.link.findUnique({
			where: {
				id
			}
		})

		if (!link) throw new NotFoundException()

		await this.prisma.link.delete({
			where: {
				id: link.id
			}
		})

		return true
	}
}
