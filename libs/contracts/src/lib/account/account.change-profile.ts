import { IUser } from '@purple/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangeProfile {
  export const topic = 'account.change-profile.command';

  export class Request {
    @IsString()
    id: string = '';

    user: Pick<IUser, 'displayName'>;

    constructor(user: Pick<IUser, 'displayName'>) {
      this.user = user;
    }
  }

  export class Response { }
}

