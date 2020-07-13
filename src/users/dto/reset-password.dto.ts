import { IsOptional } from "class-validator";

export class ResetPasswordDto {
    @IsOptional()
    email: string;

    @IsOptional()
    newPassword: string;

    @IsOptional()
    newPasswordToken: string;

    @IsOptional()
    currentPassword: string;
}
