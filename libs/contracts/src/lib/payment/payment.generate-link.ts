import { IsNumber, IsString } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsString()
    courseId: string = '';

    @IsString()
    userId: string = '';

    @IsNumber()
    sum: number = 0;
  }

  export class Response {
    paymentLink: string = '';
  }
}

