import { UserStatus } from "@prisma/client";



export interface ValidatedUser {
    readonly id: string;
    readonly type: UserStatus;
  }


  export interface TaskStatus {
    readonly id: string;
    readonly type: UserStatus;
  }
  