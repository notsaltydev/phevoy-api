import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "modules/auth/auth.module";
import { UsersModule } from "modules/users/users.module";
import { ConferenceModule } from "modules/conference/conference.module";
import { ScheduleModule } from "modules/schedule/schedule.module";
import { CoreModule } from "modules/core/core.module";
import { SharedModule } from "modules/shared/shared.module";

@Module({
    controllers: [AppController],
    imports: [
        AuthModule,
        UsersModule,
        ConferenceModule,
        ScheduleModule,
        CoreModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                synchronize: false,
                subscribers: [],
                migrationsRun: true,
                logging: true,
                logger: 'file',
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({isGlobal: true})
    ],
    providers: [AppService],
})
export class AppModule {
}
