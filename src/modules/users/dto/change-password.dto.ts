import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    currentPassword: string;
}
