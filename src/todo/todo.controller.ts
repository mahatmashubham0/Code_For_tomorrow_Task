import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query , Req, Res, UseGuards } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoDto } from "./dto/todo.dto"
import { Request, Response } from "express";
import { UpdateDto } from "./dto/update.dto";
import { JwtGuard } from "src/auth/guard";
import { UserGuard } from "./guards/user.guard";
import { ValidatedUser } from "./contants";


// @UseGuards(JwtGuard , new UserGuard)
// using this line JwtGuard and UserGuard apply on every controller
@UseGuards(JwtGuard)
@Controller('todo') 
export class TodoController {
  constructor(private readonly todoService : TodoService) {}


  // Add Task
  @UseGuards(new UserGuard)
  @Post('/add')
  async addTask(@Body() data: TodoDto, @Res() res:Response) {
    console.log(data);
    
    const result = await this.todoService.addTask(data);
    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: "Task is created",
      data: result
    })
  }


  // Update Task
  @UseGuards(new UserGuard)
  @Put('/update/:id')
  async updateTask(@Param('id', ParseIntPipe) id: number, @Body() data:UpdateDto, @Res() res:Response) {
    const result =  await this.todoService.updateTask(id, data);
    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: "Task is created",
      data: result
    })
  }


  // Delete Task
  @UseGuards(new UserGuard)
  @Delete('/remove/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number , @Res() res:Response) {
    const result = await this.todoService.removeTask(id);
    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: "Task is created",
      data: result
    })
  }


  

  // find the task according the search functionality and also apply pending || completed and using pagination
  // /todo/search?page=1&pageSize=10&search=***&status=***
  @UseGuards(new UserGuard)
  @Get('search')
  async getAllTaskBasedOnSearch(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search: string = '',
    @Query('status') status: string = '',
    @Req() req: Request  & { user: ValidatedUser },
  ) {
    return this.todoService.getTodoBasedOnTheSearch(Number(req.user.id) , Number(page), Number(pageSize), search , status);
  }



  // Find All Tasks which present in db
  @Get('/all')
  async findAllTasks(@Res() res:Response) {
    const result = await this.todoService.findAllTasks();
    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: "Task is created",
      data: result
    })
  }


  // Find One Task
  @UseGuards(new UserGuard)
  @Get('/getTaskById/:id')
  async findOneTask(@Param('id', ParseIntPipe) id: number , @Res() res:Response) {
    const result =  await this.todoService.findTask(id)
    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: "Task is created",
      data: result
    })
  }
}