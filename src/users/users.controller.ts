import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "./dto/user.dto";
import { passportConstans } from "../auth/constans";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangePasswordStatus } from "./interfaces/change-password-status.interface";

@Controller('user')
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

    @Post('change-password')
    @UseGuards(AuthGuard(passportConstans.defaultStrategy))
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<ChangePasswordStatus> {
        const isValidPassword: boolean = await this.usersService.checkPassword(changePasswordDto.email, changePasswordDto.currentPassword);

        if (isValidPassword) {
            await this.usersService.setPassword(changePasswordDto.email, changePasswordDto.newPassword);
        } else {
            return {message: 'CHANGE_PASSWORD.WRONG_CURRENT_PASSWORD', success: false};
        }
    }
}
