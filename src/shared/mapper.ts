import { UserEntity } from "../users/entity/user.entity";
import { UserDto } from "../users/dto/user.dto";
import { ScheduleEntity } from "../schedule/entity/schedule.entity";
import { ScheduleDto } from "../schedule/dto/schedule.dto";

export const toUserDto = (data: UserEntity): UserDto => {
    const {id, username, email} = data;

    let userDto: UserDto = {
        id,
        username,
        email,
    };

    return userDto;
};

export const toScheduleDto = (data: ScheduleEntity): ScheduleDto => {
    const {id, date, createdOn, updatedOn, owner, conferences} = data;

    let scheduleDto: ScheduleDto = {
        id,
        date,
        createdOn,
        updatedOn,
        owner: owner ? toUserDto(owner) : null,
        conferences
    };

    return scheduleDto;
};
