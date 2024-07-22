import { AuthGuard } from "@nestjs/passport";



export class JwtGuard extends AuthGuard('jwt'){  // this extend AuthGuard to move the strategy folder
    constructor() {
        super()
    }
}