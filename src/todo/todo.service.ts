import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TodoDto } from "./dto/todo.dto";
import { TaskStatus } from "@prisma/client";
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

  // Find All Completed || pending Tasks
  async findByFilters(id: string ,status: TaskStatus) {
    try {
        const todos = await this.prisma.todo.findMany({
          where: {
             authorID: Number(id)
          },
        });
    
        const filteredTodos = todos.filter(todo => todo.status === status);
    
        return filteredTodos;

    } catch (err) {
      console.error(err);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // find the task according the search functionality and using pagination
  async getTodoBasedOnTheSearch(id:number , page: number, pageSize: number, search: string) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where: {
          authorID: id,
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        skip,
        take,
      }),
      // this below code count the total todo
      this.prisma.todo.count(),
    ]);

    return {
      data: todos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  
  // find the task according the pagination feature
   async findDataByPagination(id: number ,page: number, pageSize: number) {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      console.log(page , pageSize , skip , take)
      const [todos, total] = await Promise.all([
        this.prisma.todo.findMany({
          where: {
            authorID: id,
          },
          skip,
          take,
        }),
        this.prisma.todo.count(),
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
    const todo = await this.prisma.user.findMany(
        {
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

  // Find All Tasks
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