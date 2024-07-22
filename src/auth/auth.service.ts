/* eslint-disable prettier/prettier */

import { BadRequestException, Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, LoginDto } from "./dto";
import * as argon from 'argon2'
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {

    constructor(private prisma: PrismaService , private userService: UsersService, private jwt: JwtService , private config: ConfigService){}
 
    // Signup user
     async signUp(dto: AuthDto){
         const user = await this.userService.createUser(dto)
         return user;      
     }
 
    // login user
     async login(@Body() dto : LoginDto){
    
        const {email,password  } = dto;

        const userInfo = await this.prisma.user.findUnique({
            where: {
              email: email
            }
        })

        // if user does not ext throw the error
        if(!userInfo) {
          throw new HttpException('User Does not Exit! Please Login', HttpStatus.FORBIDDEN);
        }

        // compare the password
        const passwordMatch = await this.checkPassword(password , userInfo.hash)

        // if password not exit then throw the error
        if(passwordMatch === false) {
            throw new BadRequestException("Password is Incorrect")
        }

        // return the response
         return this.signToken(userInfo.id , userInfo.email)

     }


    // get the user by id  
     async getUser(id:number){
       const user = await this.userService.getUser(id);
       return user;
     }


    // Check Passowrd 
     async checkPassword(planePassword:string , encryptedPassowrd: any){
       try {
           console.log(planePassword , encryptedPassowrd)
           const passwordMatch = await argon.verify(encryptedPassowrd , planePassword)
           return passwordMatch;
       } catch (error) {
           console.log("Error While password matching");
           throw error
       }
     }


    // Generate the token
     async signToken(userId: number, email:string): Promise<{access_token:string}> {
      const payload = {     // this set of line generate the token
        sub: userId,
        email,
      }
      const secret = this.config.get('SECRET_KEY')
       const token = await this.jwt.signAsync(payload , {
           expiresIn: '1h',
           secret: secret
      })
      return { access_token: token }
     }

}