import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConferenceDto } from "./dto/create-conference.dto";
import { ConferenceDto } from "./dto/conference.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ConferenceEntity } from "./entity/conference.entity";
import { Repository } from "typeorm";
import { toConferenceDto } from "../shared/mapper";
import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dto/user.dto";

@Injectable()
export class ConferenceService {
    constructor(
        @InjectRepository(ConferenceEntity)
        private readonly conferenceRepository: Repository<ConferenceEntity>,
        private readonly usersService: UsersService,
    ) {
    }

    async createConference(user: UserDto, createConferenceDto: CreateConferenceDto): Promise<ConferenceDto> {
        const username: string = user.username;
        const {name, description, startDate, endDate} = createConferenceDto;

        const owner = await this.usersService.findOne({where: {username}});

        const conference: ConferenceEntity = await this.conferenceRepository.create({
            name,
            description,
            startDate,
            endDate,
            owner
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

    async findAllConferences(user: UserDto): Promise<ConferenceDto[]> {
        const username: string = user.username;

        const owner = await this.usersService.findOne({where: {username}});

        const conferences: ConferenceEntity[] = await this.conferenceRepository.find({
            where: {owner},
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
