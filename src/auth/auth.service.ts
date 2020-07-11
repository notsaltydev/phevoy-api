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
            // generate and sign token
            await this.sendEmailVerification(user);

            const token = this._createJwtToken(user);

            status = {
                ...status,
                username: user.username,
                ...token
            };
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

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }


    async sendEmailVerification({username}: UserDto): Promise<boolean> {
        const emailToken: TokenDto = await this.createEmailToken(username);

        console.log('emailToken', emailToken);
        return null;
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
