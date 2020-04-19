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
import { ScheduleService } from "./schedule.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "../users/dto/user.dto";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ScheduleDto } from "./dto/schedule.dto";
import { ScheduleListDto } from "./dto/schedule-list.dto";

@Controller('schedule')
export class ScheduleController {

    constructor(private readonly scheduleService: ScheduleService) {
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(
        @Body() createScheduleDto: CreateScheduleDto,
        @Req() req: any,
    ): Promise<ScheduleDto> {
        const user = req.user as UserDto;

        return await this.scheduleService.createSchedule(user, createScheduleDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateSchedule(
        @Param('id', new ParseUUIDPipe()) scheduleId: string,
        @Body() scheduleDto: ScheduleDto
    ): Promise<ScheduleDto> {
        return await this.scheduleService.updateSchedule(scheduleId, scheduleDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    async findAllSchedules(@Req() req: any): Promise<ScheduleListDto> {
        const user = req.user as UserDto;
        const schedules: ScheduleDto[] = await this.scheduleService.findAllSchedules(user.id);

        return {schedules};
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async findOneScheduleById(
        @Param('id', new ParseUUIDPipe()) scheduleId: string,
    ): Promise<ScheduleDto> {
        return await this.scheduleService.findOneScheduleById(scheduleId);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuard())
    async deleteSchedule(@Param('id', new ParseUUIDPipe()) scheduleId: string): Promise<ScheduleDto> {
        return await this.scheduleService.deleteSchedule(scheduleId);
    }
}
