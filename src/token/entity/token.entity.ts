import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entity/user.entity";

@Entity('token')
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({type: 'uuid', nullable: false}) token: string;
    @Column({type: 'varchar', nullable: true}) status: string;
    @Column({type: 'timestamptz', nullable: false}) timestamp: Date;
    @CreateDateColumn() createdOn?: Date;
    @UpdateDateColumn() updatedOn?: Date;

    @ManyToOne(type => UserEntity, owner => owner.tokens)
    owner?: UserEntity;
}
