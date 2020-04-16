import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entity/user.entity";
import { ScheduleEntity } from "./entity/schedule.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ScheduleEntity, UserEntity])
    ]
})
export class ScheduleModule {
}
