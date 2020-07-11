import { IsNotEmpty } from 'class-validator';
import { UserDto } from "../../users/dto/user.dto";

export class TokenDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    timestamp: Date;

    createdOn?: Date;
    updatedOn?: Date;

    owner: UserDto;
}
