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
import { EmailService } from "../email/email.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService
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
        let token: TokenDto;

        if (this._hasExistingToken(existingToken)) {
            token = existingToken;
        } else {
            token = await this._createEmailToken(username);
        }

        await this.emailService.sendEmail({
            to: email,
            from: 'no-reply@phevoy.com',
            subject: 'Activate your Phevoy account',
            context: {
                username: username,
                redirectUrl: `https://phevoy.com/activate/${token.token}`,
            },
            templatePath: process.cwd() + '/templates/activation/index'
        });

        return token;
    }

    async resendEmailVerification(email: string): Promise<boolean> {
        const user: UserDto = await this.usersService.findOne({where: {email}});
        const token: TokenDto = await this.sendEmailVerification(user);

        return !!token;
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

            await this.emailService.sendEmail({
                to: email,
                from: 'noreply@phevoy.com',
                subject: 'Reset Password',
                context: {
                    clientUrl: 'https://phevoy.com',
                    token: newEmailToken.token,
                },
                templatePath: process.cwd() + '/templates/forgot-password/index'
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
