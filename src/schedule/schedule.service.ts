import { Injectable } from '@nestjs/common';
import { UserDto } from "../users/dto/user.dto";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ScheduleEntity } from "./entity/schedule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { ScheduleDto } from "./dto/schedule.dto";
import { toScheduleDto } from "../shared/mapper";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity)
        private readonly scheduleRepository: Repository<ScheduleEntity>,
        private readonly usersService: UsersService,
    ) {
    }

    async createSchedule(user: UserDto, createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {
        const date: Date = createScheduleDto.date;
        const username: string = user.username;

        const owner = await this.usersService.findOne({where: {username}});

        const schedule = await this.scheduleRepository.create({
            date,
            owner
        });

        await this.scheduleRepository.save(schedule);

        return toScheduleDto(schedule);
    }
}
