import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                privateKey: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [JwtModule],
})
export class SharedModule {
}
