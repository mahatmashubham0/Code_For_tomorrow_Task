import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TodoDto } from "./dto/todo.dto";
import { UpdateDto } from "./dto/update.dto";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Add Task
  async addTask(data : TodoDto) {
    try {
      const isUserExists = await this.prisma.user.findUnique({
        where: {id: data.authorID}
      });

      // user Does not exit
      if(!isUserExists) {
        throw new Error(`User with id ${data.authorID} does not exist`);
      }

      console.log(data);
      

      const task = await this.prisma.todo.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          authorID: data.authorID,
        }
       });
       console.log(task , "user is created");
       
      return task;
    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // Update Task
  async updateTask(id: number, data: UpdateDto) {
    console.log(data);
    try {
      const updatedTask = await this.prisma.todo.update({
        where: {id},
        data
      })
      return updatedTask;
    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // Delete Task
  async removeTask(id:number) {
    try {
      const deletedTask = await this.prisma.todo.delete({
        where: {id}
      });
      return deletedTask;
    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }


  // find the task according the search functionality and also apply pending || completed and using pagination
async getTodoBasedOnTheSearch(id: number, page: number, pageSize: number, search: string, status?: string) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: any = {
    authorID: id,
    title: {
      contains: search,
      mode: 'insensitive'
    }
  };

  // if present the status
  if (status) {
    where.status = status;
  }

  const [todos, total] = await Promise.all([
    this.prisma.todo.findMany({
      where,
      skip,
      take,
    }),

    this.prisma.todo.count({
      where,
    }),
  ]);

  return {
    data: todos,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

  
  // Only User can access only own todo list task can not access the another user's todo 
  async getTodoListByUserId(id:number){
    const todo = await this.prisma.user.findMany({
        where:{
          id: id,
        },
        include: {
          todos: true,
        }
      }
    );
    return todo;
    } 

  // Find All Tasks present in db
  async findAllTasks() {
    try {
    const allTasks = await this.prisma.todo.findMany()
    return allTasks;
    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // Find a single Task
  async findTask(id: number) {
    try {
      const tasksById = await this.prisma.todo.findUnique({
        where: {id}
      });
      return tasksById;
    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}