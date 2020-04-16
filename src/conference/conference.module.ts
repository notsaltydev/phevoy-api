import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entity/user.entity";
import { ConferenceEntity } from "./entity/conference.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ConferenceEntity, UserEntity])
    ]
})
export class ConferenceModule {
}
