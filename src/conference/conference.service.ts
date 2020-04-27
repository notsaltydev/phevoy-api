import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConferenceDto } from "./dto/create-conference.dto";
import { ConferenceDto } from "./dto/conference.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ConferenceEntity } from "./entity/conference.entity";
import { Repository } from "typeorm";
import { ScheduleEntity } from "../schedule/entity/schedule.entity";
import { UserEntity } from "../users/entity/user.entity";
import { toConferenceDto } from "../shared/mapper";

@Injectable()
export class ConferenceService {
    constructor(
        @InjectRepository(ConferenceEntity)
        private conferenceRepository: Repository<ConferenceEntity>,
        @InjectRepository(ScheduleEntity)
        private scheduleRepository: Repository<ScheduleEntity>
    ) {
    }

    async createConference(scheduleId: string, createConferenceDto: CreateConferenceDto): Promise<ConferenceDto> {
        const {name, description, startDate, endDate} = createConferenceDto;

        const schedule: ScheduleEntity = await this.scheduleRepository.findOne({
            where: {id: scheduleId},
            relations: ['conferences', 'owner']
        });

        const owner: UserEntity = schedule.owner;

        const conference: ConferenceEntity = await this.conferenceRepository.create({
            name,
            description,
            startDate,
            endDate,
            owner,
            schedule
        });

        await this.conferenceRepository.save(conference);

        return toConferenceDto(conference);
    }

    async updateConference(id: string, conferenceDto: ConferenceDto): Promise<ConferenceDto> {
        const {name, description, startDate, endDate} = conferenceDto;

        let conference: ConferenceEntity = await this.conferenceRepository.findOne({where: {id}});

        if (!conference) {
            throw new HttpException(
                `Conference doesn't exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        conference = {
            id,
            name,
            description,
            startDate,
            endDate
        }

        await this.conferenceRepository.update({id}, conference);

        conference = await this.conferenceRepository.findOne({
            where: {id},
            relations: ['owner'],
        });

        return toConferenceDto(conference);
    }

    async deleteConference(id: string): Promise<ConferenceDto> {
        const conference: ConferenceEntity = await this.conferenceRepository.findOne({
            where: {id}
        });

        if (!conference) {
            throw new HttpException(`Conference doesn't exist`, HttpStatus.BAD_REQUEST);
        }

        await this.conferenceRepository.delete({id});

        return toConferenceDto(conference);
    }

    async findAllConferences(id: string): Promise<ConferenceDto[]> {
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

        const conferences: ConferenceEntity[] = await this.conferenceRepository.find({
            where: {schedule},
            relations: ['owner']
        });

        return conferences.map((conference: ConferenceEntity) => toConferenceDto(conference));
    }

    async findOneConferenceById(id: string): Promise<ConferenceDto> {
        const conference: ConferenceEntity = await this.conferenceRepository.findOne({
            where: {id},
            relations: ['owner']
        });

        if (!conference) {
            throw new HttpException(
                `Conference doesn't exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return toConferenceDto(conference);
    }
}
