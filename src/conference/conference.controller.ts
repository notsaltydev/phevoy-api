import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { CreateConferenceDto } from "./dto/create-conference.dto";
import { ConferenceDto } from "./dto/conference.dto";
import { AuthGuard } from "@nestjs/passport";
import { ConferenceService } from "./conference.service";
import { ConferenceListDto } from "./dto/conference-list.dto";
import { UserDto } from "../users/dto/user.dto";

@Controller('conference')
export class ConferenceController {
    constructor(private conferenceService: ConferenceService) {
    }

    @Post()
    @UseGuards(AuthGuard())
    async createConference(
        @Req() req: any,
        @Body() createConferenceDto: CreateConferenceDto,
    ): Promise<ConferenceDto> {
        const user = req.user as UserDto;

        return await this.conferenceService.createConference(user, createConferenceDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateConference(
        @Param('id', new ParseUUIDPipe()) conferenceId: string,
        @Body() conferenceDto: ConferenceDto
    ): Promise<ConferenceDto> {
        return await this.conferenceService.updateConference(conferenceId, conferenceDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    async findAllConferences(
        @Req() req: any
    ): Promise<ConferenceListDto> {
        const user = req.user as UserDto;
        const conferences: ConferenceDto[] = await this.conferenceService.findAllConferences(user);

        return {conferences}
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async findOneConferenceById(
        @Param('id', new ParseUUIDPipe()) conferenceId: string
    ): Promise<ConferenceDto> {
        return await this.conferenceService.findOneConferenceById(conferenceId);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuard())
    async deleteConference(@Param('id', new ParseUUIDPipe()) conferenceId: string) {
        return await this.conferenceService.deleteConference(conferenceId);
    }
}
