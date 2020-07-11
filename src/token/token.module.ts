import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entity/token.entity';
import { UserEntity } from "../users/entity/user.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([TokenEntity, UserEntity])
    ],
    providers: [TokenService]
})
export class TokenModule {
}
