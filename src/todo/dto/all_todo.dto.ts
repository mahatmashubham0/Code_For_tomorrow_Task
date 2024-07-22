import { TaskStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class AllTaskDto {

  @IsOptional()
  @IsString()
  @IsEnum(TaskStatus)
  status?: string
  
}