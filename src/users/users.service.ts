import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from "./dto/user.dto";
import { LoginUserDto } from "./dto/user-login.dto";
import { CreateUserDto } from "./dto/user-create.dto";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { toUserDto } from "../shared/mapper";
import { comparePasswords } from "../shared/utils";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async findOne(options?: FindOneOptions<UserEntity>): Promise<UserDto> {
        const user: UserEntity = await this.userRepository.findOne(options);
        
        return toUserDto(user);
    }

    async findByLogin({username, password}: LoginUserDto): Promise<UserDto> {
        const user = await this.userRepository.findOne({where: {username}});

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords
        const areEqual = await comparePasswords(user.password, password);

        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return toUserDto(user);
    }

    async findByPayload({username}: any): Promise<UserDto> {
        return await this.findOne({where: {username}});
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {
        const {username, password, email} = userDto;

        // check if the user exists in the db
        const userInDb = await this.userRepository.findOne({where: {username}});
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const user: UserEntity = await this.userRepository.create({
            username,
            password,
            email,
        });

        await this.userRepository.save(user);

        return toUserDto(user);
    }

    private _sanitizeUser(user: UserEntity) {
        delete user.password;
        return user;
    }
}
