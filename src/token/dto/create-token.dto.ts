import { IsNotEmpty } from 'class-validator';
import { TokenType } from "../interfaces/token-type.enum";

export class CreateTokenDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    timestamp: Date;

    @IsNotEmpty()
    type: TokenType;
}
