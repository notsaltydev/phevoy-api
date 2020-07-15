import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entity/token.entity';
import { UserEntity } from "../users/entity/user.entity";
import { UsersModule } from "../users/users.module";


@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([TokenEntity, UserEntity])
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {
}
