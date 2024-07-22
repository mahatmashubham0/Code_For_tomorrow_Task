import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
// import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { getUser } from 'src/auth/decorators';
import { User } from '@prisma/client';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    //this is connect to strategy folder and give the access of token so that we can extract the user infomation
    @UseGuards(JwtGuard)  
    @Get('users')
    async getUserByToken(@getUser() user:User) {  // we just get the user info from the req object
        console.log("users login successfully",{
            user: user,
        })

        return user
    }
}