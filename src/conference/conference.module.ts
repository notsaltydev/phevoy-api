import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entity/user.entity";
import { ConferenceEntity } from "./entity/conference.entity";
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        TypeOrmModule.forFeature([ConferenceEntity, UserEntity])
    ],
    controllers: [ConferenceController],
    providers: [ConferenceService]
})
export class ConferenceModule {
}
