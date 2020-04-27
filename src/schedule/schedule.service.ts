import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async updateSchedule(id: string, scheduleDto: ScheduleDto): Promise<ScheduleDto> {
        const {date} = scheduleDto;

        let schedule: ScheduleEntity = await this.scheduleRepository.findOne({where: {id}});

        if (!schedule) {
            throw new HttpException(
                `Schedule doesn't exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        schedule = {
            id,
            date
        }

        await this.scheduleRepository.update({id}, schedule);

        schedule = await this.scheduleRepository.findOne({
            where: {id},
            relations: ['conferences', 'owner'],
        });

        return toScheduleDto(schedule);
    }

    async findAllSchedules(id: string): Promise<ScheduleDto[]> {
        const owner: UserDto = await this.usersService.findOne({where: {id}})
        const schedules: ScheduleEntity[] = await this.scheduleRepository.find({
            where: {owner},
            relations: ['conferences', 'owner']
        });

        return schedules.map((schedule: ScheduleEntity) => toScheduleDto(schedule));
    }

    async findOneScheduleById(id: string): Promise<ScheduleDto> {
        const schedule: ScheduleEntity = await this.scheduleRepository.findOne({
            where: {id},
            relations: ['conferences', 'owner']
        });

        if (!schedule) {
            throw new HttpException(
                `Schedule doesn't exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return toScheduleDto(schedule)
    }

    async deleteSchedule(id: string): Promise<ScheduleDto> {
        const schedule: ScheduleEntity = await this.scheduleRepository.findOne({
            where: {id}
        });

        if (!schedule) {
            throw new HttpException(`Schedule doesn't exist`, HttpStatus.BAD_REQUEST);
        }

        await this.scheduleRepository.delete({id});

        return toScheduleDto(schedule);
    }
}
