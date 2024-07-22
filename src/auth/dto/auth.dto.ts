/* eslint-disable prettier/prettier */

import { UserStatus } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {


    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    firstname?: string

    @IsString()
    lastname?: string

    @IsString()
    @IsEnum(UserStatus)
    status?: string

}