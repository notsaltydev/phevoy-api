import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { ConferenceEntity } from "../../conference/entity/conference.entity";
import { UserEntity } from "../../users/entity/user.entity";

@Entity('schedule')
export class ScheduleEntity {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({type: "date", nullable: false}) date: Date;
    @CreateDateColumn() createdOn?: Date;
    @UpdateDateColumn() updatedOn?: Date;

    @ManyToOne(type => UserEntity)
    owner?: UserEntity;

    @OneToMany(type => ConferenceEntity, conference => conference.schedule)
    conferences?: ConferenceEntity[];
}
