import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    newPasswordToken: string;
}
