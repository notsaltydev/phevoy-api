import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from "./schedule.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "../users/dto/user.dto";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ScheduleDto } from "./dto/schedule.dto";

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
}
