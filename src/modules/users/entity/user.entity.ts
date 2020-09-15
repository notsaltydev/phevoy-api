import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenEntity } from "../../token/entity/token.entity";
import { userConstans } from "../constans";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({type: 'varchar', nullable: false, unique: true}) username: string;
    @Column({type: 'varchar', nullable: false}) password: string;
    @Column({type: 'varchar', nullable: false}) email: string;
    @CreateDateColumn() createdOn?: Date;
    @UpdateDateColumn() updatedOn?: Date;

    @OneToMany(type => TokenEntity, token => token.owner)
    tokens?: TokenEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, userConstans.saltOrRounds);
    }
}
