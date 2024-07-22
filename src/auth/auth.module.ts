/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./stratergy";
import { TodoModule } from "src/todo/todo_module";

@Module({
    imports: [
        JwtModule.register({}),   // register the Jwt Configuration
        PrismaModule, 
        UsersModule,
        TodoModule
    ],
    providers: [AuthService , JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {
}