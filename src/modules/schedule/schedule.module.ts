import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    providers: [ScheduleService],
    controllers: [ScheduleController]
})
export class ScheduleModule {
}
