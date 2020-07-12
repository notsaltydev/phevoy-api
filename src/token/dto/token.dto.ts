import { IsNotEmpty } from 'class-validator';
import { UserDto } from "../../users/dto/user.dto";
import { TokenType } from "../interfaces/token-type.enum";

export class TokenDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    timestamp: Date;

    @IsNotEmpty()
    type: TokenType;

    createdOn?: Date;
    updatedOn?: Date;

    owner: UserDto;
}
