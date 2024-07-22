import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request,"We got data",JSON.stringify(request.user));
    console.log(request.user.status)

    if(request.user.status === UserStatus.User) {
      console.log("He is Users");
        return true
    }
    return false;
  }
}