import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entity/user.entity";
import { ScheduleEntity } from "./entity/schedule.entity";
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        TypeOrmModule.forFeature([ScheduleEntity, UserEntity])
    ],
    providers: [ScheduleService],
    controllers: [ScheduleController]
})
export class ScheduleModule {
}
