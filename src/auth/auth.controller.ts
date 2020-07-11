import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
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
    public async verifyEmail(@Param() params: any): Promise<any> {
        try {
            // const isEmailVerified: boolean = await this.authService.verifyEmail(params.token);

            // return new ResponseSuccess('LOGIN.EMAIL_VERIFIED', isEmailVerified);
            return null;
        } catch (error) {
            // return new ResponseError('LOGIN.ERROR', error);
        }
    }

    @Get('resend-verification/:email')
    public resendEmailVerification(@Param() params: any): Promise<any> {
        try {
            // await this.authService.createEmailToken(params.email);

            // const isEmailSent = await this.authService.sendEmailVerification(params.email);

            // if (isEmailSent) {
            //     return new ResponseSuccess('LOGIN.EMAIL_RESENT', null);
            // } else {
            //     return new ResponseError('REGISTRATION.EMAIL.MAIL_NOT_SENT');
            // }
            return null;
        } catch (error) {
            // return new ResponseError('LOGIN.ERROR.SEND_EMAIL', error);
        }
    }

    @Get('forgot-password/:email')
    public sendEmailForgotPassword(@Param() params: any): Promise<any> {
        try {
            // const isEmailForgotPasswordSent = await this.authService.sendEmailForgotPassword(params.email);

            // if (isEmailForgotPasswordSent) {
            //     return new ResponseSuccess('LOGIN.EMAIL_RESENT', null);
            // } else {
            //     return new ResponseError('REGISTRATION.EMAIL.MAIL_NOT_SENT');
            // }
            return null;
        } catch (error) {
            // return new ResponseError('LOGIN.ERROR.SEND_EMAIL', error);
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    // public async setNewPassword(@Body() resetPassword: ResetPasswordDto): Promise<any> {
    public async setNewPassword(@Body() resetPassword: any): Promise<any> {
        try {
            // let isNewPasswordChanged: boolean;

            // if (resetPassword.email && resetPassword.currentPassword) {
            //     const isValidPassword: boolean = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);

                // if (isValidPassword) {
                //     isNewPasswordChanged = await this.userService.setPassword(resetPassword.email, resetPassword.newPassword);
                // } else {
                //     return new ResponseError('RESET_PASSWORD.WRONG_CURRENT_PASSWORD');
                // }
            // } else if (resetPassword.newPasswordToken) {
            //     const forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);

                // isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.newPassword);

                // if (isNewPasswordChanged) await forgottenPasswordModel.remove();
            // } else {
            //     return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR");
            // }

            // return new ResponseSuccess("RESET_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
        } catch (error) {
            // return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR", error);
        }
    }


    @Get('whoami')
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
        return req.user;
    }
}
