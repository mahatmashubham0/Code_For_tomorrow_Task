import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async createUser(data : AuthDto): Promise<User>{

        // it check the User already exit or not
        const exitingUser = await this.prisma.user.findUnique({   
            where: {
                email: data.email
            }
        })         

        // if user does not ext throw the error
        if(exitingUser) {
            throw new HttpException('User Already Exit! Please Login', HttpStatus.FORBIDDEN);
        }

        // if user exist so hash password
        const hashPassword = await argon.hash(data.password)

        const user = await this.prisma.user.create({
            data:{
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                hash: hashPassword 
            }
        })

        delete user.hash
        return user;
    }

    async getUser(id: number): Promise<User> {

        const user = await this.prisma.user.findUnique({
            where:{
                id: Number(id)
            }
        })
        // if user does not ext throw the error
        if(!user) {
            throw new HttpException('User Does not Exit! Please Register', HttpStatus.FORBIDDEN);
        }

        delete user.hash;
        return user;

    }

}
