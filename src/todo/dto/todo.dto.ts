import { TaskStatus } from "@prisma/client";
import {  IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TodoDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsString()
  @IsNotEmpty()
  priority?: string;

  @IsInt()
  @IsNotEmpty()
  authorID: number;
}
