import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';


@Controller('statistic')
export class StatisticController {
	constructor(private readonly statisticService: StatisticService) { }

	@Get(':id/overview')
	getStatistic(@Param('id') id: string) {
		return this.statisticService.getAllStatistic(id)
	}

}
