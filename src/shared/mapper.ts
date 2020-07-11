import { UserEntity } from "../users/entity/user.entity";
import { UserDto } from "../users/dto/user.dto";
import { ConferenceEntity } from "../conference/entity/conference.entity";
import { ConferenceDto } from "../conference/dto/conference.dto";
import { TokenEntity } from "../token/entity/token.entity";
import { TokenDto } from "../token/dto/token.dto";

export const toUserDto = (data: UserEntity): UserDto => {
    const {id, username, email} = data;

    let userDto: UserDto = {
        id,
        username,
        email,
    };

    return userDto;
};

export const toConferenceDto = (data: ConferenceEntity): ConferenceDto => {
    const {id, name, startDate, endDate, description, createdOn, updatedOn, owner} = data;

    let conferenceDto: ConferenceDto = {
        id,
        name,
        startDate,
        endDate,
        description,
        createdOn,
        updatedOn,
        owner: owner ? toUserDto(owner) : null,

    };

    return conferenceDto;
};

export const toTokenDto = (data: TokenEntity): TokenDto => {
    const {id, token, status, timestamp, createdOn, updatedOn, owner} = data;

    let tokenDto: TokenDto = {
        id,
        token,
        status,
        timestamp,
        createdOn,
        updatedOn,
        owner
    };

    return tokenDto;
};
