import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "./dto/user.dto";
import { passportConstans } from "../auth/constans";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @Get('me')
    @UseGuards(AuthGuard(passportConstans.defaultStrategy))
    async findUserMe(
        @Req() req: any
    ): Promise<UserDto> {
        const user = req.user as UserDto;

        return await this.usersService.findOne({where: {id: user.id}});
    }

    @Get(':id')
    @UseGuards(AuthGuard(passportConstans.defaultStrategy))
    async findUserById(
        @Param('id', new ParseUUIDPipe()) userId: string
    ): Promise<UserDto> {
        return await this.usersService.findOne({where: {id: userId}});
    }
}
