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
            endDate,
            updatedOn: new Date()
        }

        await this.conferenceRepository.update({id}, conference);

        conference = await this.conferenceRepository.findOne({
            where: {id},
            relations: ['owner'],
        });

        return toConferenceDto(conference);
    }
}
