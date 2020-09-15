import { IsNotEmpty } from 'class-validator';
import { UserDto } from "../../users/dto/user.dto";

export class ScheduleDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    date: Date;

    createdOn?: Date;
    updatedOn?: Date;

    owner: UserDto;

    conferences?: any[];
}
