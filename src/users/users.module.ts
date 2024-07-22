/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    // imports: [PrismaModule], // If We want to use Prisma so we can import Prisma Module and then We can use it and
    // Another way is Import Prisma Service directly 
    controllers: [UsersController],
    providers: [UsersService , PrismaService],
    exports: [UsersService],
    // If we want to use one module service to another module so we have to export that all service and which want to use another module.
})


export class UsersModule {}
