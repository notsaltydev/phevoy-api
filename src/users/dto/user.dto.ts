import { IsEmail, IsNotEmpty } from 'class-validator';
import { TokenDto } from "../../token/dto/token.dto";

export class UserDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    tokens?: TokenDto[]

    createdOn?: Date;
}
