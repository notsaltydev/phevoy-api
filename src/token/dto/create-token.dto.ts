import { IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    timestamp: Date;
}
