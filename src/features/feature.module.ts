import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { LinkModule } from './link/link.module';
import { CronModule } from "./cron/cron.module";
import { StatisticModule } from './statistic/statistic.module';


@Module({
	imports: [AuthModule, LinkModule, CronModule, StatisticModule]
})
export class FeatureModule { }