import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from "./jwt.strategy";
import { jwtConstants, passportConstans } from "./constans";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";

@Module({
    imports: [
        UsersModule,
        TokenModule,
        PassportModule.register({
            defaultStrategy: passportConstans.defaultStrategy,
            property: 'user',
            session: false,
        }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: jwtConstants.expiresIn,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule]
})
export class AuthModule {
}
