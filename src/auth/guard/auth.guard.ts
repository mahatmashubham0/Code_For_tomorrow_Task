import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("hello");
    
    console.log(request.user.status , request.user);
    
    if(request.user.status === UserStatus.User) {
        console.log(`Welcome ${request.user.firstname}!!`);
        return true
    }
    return false;
  }
}