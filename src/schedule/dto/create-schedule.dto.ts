import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
    @IsNotEmpty()
    date: Date;
}
