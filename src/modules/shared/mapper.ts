import { UserEntity } from "../users/entity/user.entity";
import { UserDto } from "../users/dto/user.dto";
import { ConferenceEntity } from "../conference/entity/conference.entity";
import { ConferenceDto } from "../conference/dto/conference.dto";
import { TokenEntity } from "../token/entity/token.entity";
import { TokenDto } from "../token/dto/token.dto";

export const toUserDto = (data: UserEntity): UserDto => {
    const {id, username, email, tokens} = data;

    let userDto: UserDto = {
        id,
        username,
        email,
    };

    if (tokens) {
        userDto = {
            ...userDto,
            tokens: tokens.map((token: TokenEntity) => toTokenDto(token)),
        };
    }

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
    const {id, token, status, timestamp, type, createdOn, updatedOn, owner} = data;

    let tokenDto: TokenDto = {
        id,
        token,
        status,
        timestamp,
        type,
        createdOn,
        updatedOn,
        owner: owner ? toUserDto(owner) : null,
    };

    return tokenDto;
};
