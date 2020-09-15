import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { toTokenDto } from "../shared/mapper";
import { TokenDto } from "./dto/token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { TokenEntity } from "./entity/token.entity";
import { CreateTokenDto } from "./dto/create-token.dto";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";
import { UserDto } from "../users/dto/user.dto";


@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
        private readonly usersService: UsersService
    ) {
    }

    public async findOne(options?: FindOneOptions<TokenEntity>): Promise<TokenDto> {
        const token: TokenEntity = await this.tokenRepository.findOne(options);

        return toTokenDto(token);
    }

    public async createToken(username: string, createTokenDto: CreateTokenDto): Promise<TokenDto> {
        const {token, status, type, timestamp} = createTokenDto;

        const owner: UserDto = await this.usersService.findOne({where: {username}});

        const newToken: TokenEntity = await this.tokenRepository.create({
            token,
            status,
            type,
            timestamp,
            owner
        });

        await this.tokenRepository.save(newToken);

        return toTokenDto(newToken);
    }

    public async deleteToken(id: string): Promise<TokenDto> {
        const token: TokenEntity = await this.tokenRepository.findOne({
            where: {id}
        });

        if (!token) {
            throw new HttpException(`Token doesn't exist`, HttpStatus.BAD_REQUEST);
        }

        await this.tokenRepository.delete({id});

        return toTokenDto(token);
    }
}
