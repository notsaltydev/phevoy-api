import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entity/user.entity";

@Entity('conference')
export class ConferenceEntity {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({type: 'varchar', nullable: false}) name: string;
    @Column({type: 'text', nullable: true}) description: string;
    @Column({type: 'timestamptz', nullable: false}) startDate: Date;
    @Column({type: 'timestamptz', nullable: false}) endDate: Date;
    @CreateDateColumn() createdOn?: Date;
    @UpdateDateColumn() updatedOn?: Date;

    @ManyToOne(type => UserEntity)
    owner?: UserEntity;
}
