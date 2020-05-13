import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from "./schedule.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "../users/dto/user.dto";
import { ScheduleDto } from "./dto/schedule.dto";
import { ScheduleListDto } from "./dto/schedule-list.dto";

@Controller('schedule')
export class ScheduleController {

    constructor(private readonly scheduleService: ScheduleService) {
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
}
