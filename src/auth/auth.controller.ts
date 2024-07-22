/* eslint-disable prettier/prettier */

import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, LoginDto } from "./dto";
import { Response } from "express";
import { AuthGuard } from "./guard/auth.guard";
import { JwtGuard } from "./guard";
import { ValidatedUser } from "src/todo/contants";
import { TodoService } from "src/todo/todo.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService , private readonly todoService: TodoService){}

    //auth/signin
    @Post('signup')
        async signup(@Body() data: AuthDto , @Res() res: Response){
        const result =  await this.authService.signUp(data)
        return res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'User Signup Successfully',
            error: {},
            data: result,
        });
    }


    // auth/signup
    @Post('signin')
        async signin(@Body() dto:LoginDto , @Res() res: Response){
        const result = await this.authService.login(dto)
        const {access_token} = result
        console.log(result)
        return res.status(HttpStatus.OK).cookie('token',access_token).json({
            success: true,
            message: 'User is logged',
            error: {},
            data: result,
        });
    }


    // Only User can access his own todo list and task can not accessable by another user
    @Get('userAllTask') 
    @UseGuards(JwtGuard , AuthGuard)
    async getAllTaskByUserId(
        @Req() req: Request  & { user: ValidatedUser },
    ) {
        return await this.todoService.getTodoListByUserId(Number(req.user.id))
    }


    // protected route by using the jwt only user can access their info
    @Get('user/:id')
    @UseGuards(JwtGuard , AuthGuard)
    async getUserDetails(@Param('id') id:number ) {
        console.log(id);
        const result = await this.authService.getUser(id);
        return {
            status: true,
            msg: "Request task is Completed",
            error: {},
            data: result,
        }    
    }

    
}