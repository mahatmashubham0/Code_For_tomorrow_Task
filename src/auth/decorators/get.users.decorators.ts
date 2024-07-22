import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    console.log("data",request.user)
    return request.user;
  },
);