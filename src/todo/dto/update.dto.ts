import { TaskStatus } from "@prisma/client";
import {  IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  priority?: string;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  authorID: number;
}
