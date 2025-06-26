import { PurchaseState } from '@purple/interfaces';
import { IsString } from 'class-validator';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.query';

  export class Request {
    @IsString()
    userId: string = '';

    @IsString()
    courseId: string = '';
  }

  export class Response {
    status: PurchaseState = PurchaseState.Canceled;
  }
}

