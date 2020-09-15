import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateConferenceDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    startDate: Date;

    @IsNotEmpty()
    endDate: Date;

    @IsOptional()
    @MaxLength(500)
    description: string;

}
