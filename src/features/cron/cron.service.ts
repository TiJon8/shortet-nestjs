import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CronService {

	private logger = new Logger(CronService.name)

	@Cron(CronExpression.EVERY_10_SECONDS, {
		name: 'notifications',
		disabled: true
	})
	handle() {
		this.logger.log('Начало задачи')
	}
}