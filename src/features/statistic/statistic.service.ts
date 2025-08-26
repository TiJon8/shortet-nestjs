import { Injectable } from '@nestjs/common';
import { lookup } from 'geoip-country';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UAParser } from 'ua-parser-js';


// TODO покапаться в универсальной функции

// function accamulationStatistic(entity: Click[], func: any, f: 'userAgent' | 'ip', o: StatisticService) {
// 	const stats = entity.reduce((acc, val) => {
// 		const { field } = o.func(val[f])

// 		if (acc[field]) {
// 			acc[field] += 1
// 		} else {
// 			acc[field] = 1
// 		}

// 		return acc
// 	}, {})
// 	return stats
// }

@Injectable()
export class StatisticService {
	private uaParser: UAParser

	constructor(private prisma: PrismaService) {
		this.uaParser = new UAParser()
	}

	async getAllStatistic(id: string) {
		const browsers = await this.getBrowsersStats(id)
		const countries = await this.getCountriesStats(id)

		return { browsers, countries }
	}

	async getBrowsersStats(id: string) {
		const clicks = await this.getClicks(id)

		const stats = clicks.reduce((acc, val) => {
			const { browser } = this.getBrowserByUserAgent(val.userAgent)

			if (acc[browser]) {
				acc[browser] += 1
			} else {
				acc[browser] = 1
			}

			return acc
		}, {})

		return stats
	}

	async getCountriesStats(id: string) {
		const clicks = await this.getClicks(id)

		const stats = clicks.reduce((acc, val) => {
			const { country } = this.getCountryByIP(val.ip)

			if (acc[country]) {
				acc[country] += 1
			} else {
				acc[country] = 1
			}

			return acc
		}, {})

		return stats
	}

	private async getClicks(id: string) {
		return await this.prisma.click.findMany({
			where: {
				linkId: id
			}
		})
	}

	getBrowserByUserAgent(ua: string) {
		const res = this.uaParser.setUA(ua).getResult()
		console.log(res)
		return { browser: res.browser.name! }
	}

	getCountryByIP(ip: string) {
		let u: string;
		const geo = lookup(ip)
		console.log(JSON.stringify(geo))
		return { country: geo?.name ?? 'Нет данных' }
	}

}
