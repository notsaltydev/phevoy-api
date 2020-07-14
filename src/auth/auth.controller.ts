import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { RegistrationStatus } from "./interfaces/registration-status.interface";
import { LoginStatus } from "./interfaces/login-status.interface";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { CreateUserDto } from "../users/dto/user-create.dto";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { AuthGuard } from "@nestjs/passport";
import { EmailVerificationStatus } from "./interfaces/email-verification-status.interface";
import { ResendEmailVerificationStatus } from "./interfaces/resend-email-verification-status.interface";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";
import { TokenDto } from "../token/dto/token.dto";
import { SendEmailForgotPasswordStatus } from "./interfaces/send-email-forgot-password-status.interface";
import { ResetPasswordStatus } from "./interfaces/reset-password-status.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);
    }

    @Post('register')
    public async register(
        @Body() createUserDto: CreateUserDto,
    ): Promise<RegistrationStatus> {
        const result: RegistrationStatus = await this.authService.register(
            createUserDto,
        );

        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        }

        return result;
    }

    @Get('verify/:token')
    public async verifyEmail(
        @Param('token', new ParseUUIDPipe()) token: string
    ): Promise<EmailVerificationStatus> {
        try {
            const isEmailVerified: boolean = await this.authService.verifyEmail(token);

            return {
                message: 'LOGIN.EMAIL_VERIFIED',
                success: true
            };
        } catch (error) {
            return {
                message: 'LOGIN.ERROR',
                success: false
            };
        }
    }

    @Get('resend-verification/:email')
    public async resendEmailVerification(@Param('email') email: string): Promise<ResendEmailVerificationStatus> {
        try {
            const isEmailSent = await this.authService.resendEmailVerification(email);

            if (isEmailSent) {
                return {message: 'LOGIN.EMAIL_RESENT', success: true};
            } else {
                return {message: 'VERIFICATION.EMAIL.MAIL_NOT_SENT', success: false};
            }
        } catch (error) {
            return {message: 'LOGIN.ERROR.SEND_EMAIL', success: false};
        }
    }

    @Get('forgot-password/:email')
    public async sendEmailForgotPasswordVerification(@Param('email') email: string): Promise<SendEmailForgotPasswordStatus> {
        try {
            const isEmailForgotPasswordSent = await this.authService.sendEmailForgotPasswordVerification(email);

            if (isEmailForgotPasswordSent) {
                return {message: 'FORGOT_PASSWORD.EMAIL_FORGOT_PASSWORD.MAIL_SENT', success: true};
            } else {
                return {message: 'FORGOT_PASSWORD.EMAIL_FORGOT_PASSWORD.MAIL_NOT_SENT', success: false};
            }
        } catch (error) {
            return {message: 'FORGOT_PASSWORD.ERROR.SEND_EMAIL', success: false};
        }
    }

    @Post('reset-password')
    public async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<ResetPasswordStatus> {
        try {
            let isNewPasswordChanged: boolean;

            if (resetPasswordDto.newPasswordToken) {
                const verifyForgottenPassword: TokenDto = await this.authService.verifyForgottenPassword(resetPasswordDto.newPasswordToken);

                isNewPasswordChanged = await this.authService.setUserPassword(verifyForgottenPassword.owner.email, resetPasswordDto.newPassword);

                if(isNewPasswordChanged) await this.authService.removeForgottenPasswordToken(verifyForgottenPassword.id);
            } else {
                return {message: 'RESET_PASSWORD.CHANGE_PASSWORD_ERROR', success: false};
            }

            return {message: 'RESET_PASSWORD.PASSWORD_CHANGED', success: true};
        } catch (error) {
            return {message: 'RESET_PASSWORD.CHANGE_PASSWORD_ERROR', success: false};
        }
    }


    @Get('whoami')
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
        return req.user;
    }
}
