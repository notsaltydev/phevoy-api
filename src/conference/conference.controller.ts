import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateConferenceDto } from "./dto/create-conference.dto";
import { ConferenceDto } from "./dto/conference.dto";
import { AuthGuard } from "@nestjs/passport";
import { ConferenceService } from "./conference.service";

@Controller('conference')
export class ConferenceController {
    constructor(private conferenceService: ConferenceService) {
    }

    @Post(':id')
    @UseGuards(AuthGuard())
    async create(
        @Param('id') scheduleId: string,
        @Body() createConferenceDto: CreateConferenceDto,
    ): Promise<ConferenceDto> {
        return await this.conferenceService.createConference(scheduleId, createConferenceDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async update(
        @Param('id') conferenceId: string,
        @Body() conferenceDto: ConferenceDto
    ): Promise<ConferenceDto> {
        return await this.conferenceService.updateConference(conferenceId, conferenceDto);
    }
}
