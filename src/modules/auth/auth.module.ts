import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from "./jwt.strategy";
import { passportConstants } from "common/constants";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [
        UsersModule,
        TokenModule,
        EmailModule,
        PassportModule.register({
            defaultStrategy: passportConstants.defaultStrategy,
            property: 'user',
            session: false,
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule]
})
export class AuthModule {
}
