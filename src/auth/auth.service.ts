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

    async verifyEmail(token: string): Promise<boolean> {
        try {
            const emailVerificationToken: TokenDto = await this.tokenService.findOne({where: {token}, relations: ['owner']});

            if (emailVerificationToken) {
                const owner: UserDto = await this.usersService.findOne({where: {id: emailVerificationToken.owner.id}});

                // todo: Change user verification field to verified.
                return !!owner;
            }
        } catch (error) {
            return false
        }
    }

    async resendEmailVerification(email: string): Promise<boolean> {
        try {
            const user: UserDto = await this.usersService.findOne({where: {email}});
            const token: TokenDto = await this.sendEmailVerification(user);

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


    async sendEmailVerification({username, email}: UserDto): Promise<TokenDto> {
        const existingToken: TokenDto = await this._checkExistingToken(email);

        if (this._hasExistingToken(existingToken)) {
            return existingToken;
        } else {
            const newEmailToken: TokenDto = await this.createEmailToken(username);

            return newEmailToken;
        }
    }

    async createEmailToken(username: string): Promise<TokenDto> {
        const createTokenDto: CreateTokenDto = {
            token: randomStringGenerator(),
            status: 'not-verified',
            timestamp: new Date()
        };

        const newToken: TokenDto = await this.tokenService.createToken(username, createTokenDto);

        return newToken;
    }

    private async _checkExistingToken(email: string): Promise<TokenDto | null> {
        const user: UserDto = await this.usersService.findOne({where: {email}, relations: ['tokens']});

        if (user.tokens && !!user.tokens.length) {
            return user.tokens[0];
        }

        return null;
    }

    private _hasExistingToken(token: TokenDto): boolean {
        return !!token;
    }

    private _createJwtToken({username}: UserDto): any {
        const expiresIn = jwtConstants.expiresIn;

        const user: JwtPayload = {username};
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn,
            accessToken,
        };
    }


}
