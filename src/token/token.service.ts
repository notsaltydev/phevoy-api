import { Injectable } from '@nestjs/common';
import { toTokenDto } from "../shared/mapper";
import { TokenDto } from "./dto/token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { TokenEntity } from "./entity/token.entity";
import { CreateTokenDto } from "./dto/create-token.dto";


@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
        private readonly usersService: UsersService
    ) {
    }

    async createToken(username: string, createTokenDto: CreateTokenDto): Promise<TokenDto> {
        const {token, status, timestamp} = createTokenDto;

        const owner = await this.usersService.findOne({where: {username}});

        const newToken: TokenEntity = await this.tokenRepository.create({
            token,
            status,
            timestamp,
            owner
        });

        await this.tokenRepository.save(newToken);

        return toTokenDto(newToken);
    }
}
