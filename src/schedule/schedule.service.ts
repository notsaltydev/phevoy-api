import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
    async findAllSchedules(id: string): Promise<any[]> {
        return null;
    }

    async findOneScheduleById(id: string): Promise<any> {
        return null;
    }
}
