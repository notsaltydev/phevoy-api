import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
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
    async createConference(
        @Param('id', new ParseUUIDPipe()) scheduleId: string,
        @Body() createConferenceDto: CreateConferenceDto,
    ): Promise<ConferenceDto> {
        return await this.conferenceService.createConference(scheduleId, createConferenceDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateConference(
        @Param('id', new ParseUUIDPipe()) conferenceId: string,
        @Body() conferenceDto: ConferenceDto
    ): Promise<ConferenceDto> {
        return await this.conferenceService.updateConference(conferenceId, conferenceDto);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuard())
    async deleteConference(@Param('id', new ParseUUIDPipe()) conferenceId: string) {
        return await this.conferenceService.deleteConference(conferenceId);
    }
}
