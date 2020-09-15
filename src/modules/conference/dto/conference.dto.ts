import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UserDto } from "../../users/dto/user.dto";

export class ConferenceDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    startDate: Date;

    @IsNotEmpty()
    endDate: Date;

    @IsOptional()
    @MaxLength(500)
    description: string;

    createdOn?: Date;
    updatedOn?: Date;

    owner: UserDto;
}
