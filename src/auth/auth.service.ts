import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { RegistrationStatus } from "./interfaces/registration-status.interface";
import { LoginStatus } from "./interfaces/login-status.interface";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/user-create.dto";
import { LoginUserDto } from "../users/dto/user-login.dto";
import { UserDto } from "../users/dto/user.dto";
import { jwtConstants } from "./constans";
import { TokenDto } from "../token/dto/token.dto";
import { TokenService } from "../token/token.service";
import { CreateTokenDto } from "../token/dto/create-token.dto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { TokenType } from "../token/interfaces/token-type.enum";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";

export interface SMTPTransportConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}

const smtpTransportConfig: SMTPTransportConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'phevoyapp@gmail.com',
    pass: ''
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
    ) {
    }

    async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: 'user registered',
        };

        try {
            const user = await this.usersService.create(userDto);

            await this.sendEmailVerification(user);
        } catch (err) {
            status = {
                success: false,
                message: err,
            };
        }

        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
        // find user in db
        const user = await this.usersService.findByLogin(loginUserDto);

        // generate and sign token
        const token = this._createJwtToken(user);

        return {
            username: user.username,
            ...token,
        };
    }

    async verifyEmail(token: string): Promise<TokenDto> {
        const emailVerificationToken: TokenDto = await this.tokenService.findOne({
            where: {token, type: TokenType.EMAIL},
            relations: ['owner']
        });

        if (!emailVerificationToken) {
            throw new HttpException('Invalid Email Verification Token', HttpStatus.UNAUTHORIZED);
        }

        // todo: Change user verification field to verified.
        const owner: UserDto = await this.usersService.findOne({where: {id: emailVerificationToken.owner.id}});

        return emailVerificationToken;
    }

    async sendEmailVerification({username, email}: UserDto): Promise<TokenDto> {
        const existingToken: TokenDto = await this._checkExistingToken(email, TokenType.EMAIL);

        if (this._hasExistingToken(existingToken)) {
            return existingToken;
        } else {
            const newEmailToken: TokenDto = await this._createEmailToken(username);

            // todo: Send e-mail message.
            await this._sendEmail({
                email,
                clientUrl: 'https://phevoy.com',
                token: newEmailToken.token,
                subject: 'Verify Email',
                text: 'Verify Email'
            });

            return newEmailToken;
        }
    }

    async resendEmailVerification(email: string): Promise<boolean> {
        const user: UserDto = await this.usersService.findOne({where: {email}});
        const token: TokenDto = await this.sendEmailVerification(user);

        return await this._sendEmail({
            email,
            clientUrl: 'https://phevoy.com',
            token: token.token,
            subject: 'Verify Email',
            text: 'Verify Email'
        });
    }

    async sendEmailForgotPasswordVerification(email: string): Promise<boolean> {
        try {
            const user: UserDto = await this.usersService.findOne({where: {email}});
            const token: TokenDto = await this._sendPasswordForgotTokenVerification(user);

            return !!token
        } catch (error) {
            return false;
        }
    }

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);

        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async setUserPassword(email: string, password: string): Promise<boolean> {
        const isNewPasswordChanged: UserDto = await this.usersService.setPassword(email, password);

        return !!isNewPasswordChanged;
    }

    async verifyForgottenPassword(token: string): Promise<TokenDto> {
        const forgottenPasswordVerificationToken: TokenDto = await this.tokenService.findOne({
            where: {token, type: TokenType.PASSWORD},
            relations: ['owner']
        });

        if (!forgottenPasswordVerificationToken) {
            throw new HttpException('Invalid Forgotten Password Token', HttpStatus.UNAUTHORIZED);
        }

        return forgottenPasswordVerificationToken;
    }

    async removeToken(id: string): Promise<TokenDto> {
        const token: TokenDto = await this.tokenService.deleteToken(id);

        return token;
    }

    private async _sendPasswordForgotTokenVerification({username, email}: UserDto): Promise<TokenDto> {
        const existingToken: TokenDto = await this._checkExistingToken(email, TokenType.PASSWORD);

        if (this._hasExistingToken(existingToken)) {
            return existingToken;
        } else {
            const newEmailToken: TokenDto = await this._createForgotPasswordToken(username);

            // todo: Send e-mail message.
            await this._sendEmail({
                email,
                clientUrl: 'https://phevoy.com',
                token: newEmailToken.token,
                subject: 'Reset Password',
                text: 'Reset Password'
            });

            return newEmailToken;
        }
    }

    private async _createEmailToken(username: string): Promise<TokenDto> {
        const createTokenDto: CreateTokenDto = {
            token: randomStringGenerator(),
            status: 'not-verified',
            timestamp: new Date(),
            type: TokenType.EMAIL
        };

        const newToken: TokenDto = await this.tokenService.createToken(username, createTokenDto);

        return newToken;
    }

    private async _createForgotPasswordToken(username: string): Promise<TokenDto> {
        const createTokenDto: CreateTokenDto = {
            token: randomStringGenerator(),
            status: 'not-verified',
            timestamp: new Date(),
            type: TokenType.PASSWORD
        };

        const newToken: TokenDto = await this.tokenService.createToken(username, createTokenDto);

        return newToken;
    }

    private async _checkExistingToken(email: string, tokenType: TokenType): Promise<TokenDto | null> {
        const user: UserDto = await this.usersService.findOne({where: {email}, relations: ['tokens']});

        // todo: check token type.
        if (user.tokens && !!user.tokens.length) {
            return user.tokens.filter((token) => token.type == tokenType)[0];
        }

        return null;
    }

    private _hasExistingToken(token: TokenDto): boolean {
        // todo: Check timestamp.
        return !!token;
    }

    private async _sendEmail(config: { email: string, token: string, clientUrl: string, subject: string, text: string }): Promise<boolean> {
        const transporter: Mail = createTransport({
            host: smtpTransportConfig.host,
            port: smtpTransportConfig.port,
            secure: smtpTransportConfig.secure, // true for 465, false for other ports
            auth: {
                user: smtpTransportConfig.user,
                pass: smtpTransportConfig.pass
            }
        });

        const mailOptions: Mail.Options = {
            from: '"Phevoy" <' + smtpTransportConfig.user + '>',
            to: config.email,
            subject: config.subject,
            text: config.text,
            html: 'Hi! <br><br> Thanks for your registration<br><br>' +
                '<a href=' + config.clientUrl + '/auth/email/verify/' + config.token + '>Click here to activate your account</a>'
        };

        const sent: boolean = await new Promise<boolean>(async function (resolve, reject) {
            return transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Message sent: %s', error);
                    return reject(false);
                }

                console.log('Message sent: %s', info.messageId);
                resolve(true);
            });
        })

        return sent;
    }

    private _createJwtToken({username}: UserDto): { expiresIn: string, accessToken: string } {
        const expiresIn = jwtConstants.expiresIn;

        const user: JwtPayload = {username};
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn,
            accessToken,
        };
    }
}
