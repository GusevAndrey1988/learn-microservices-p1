import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@purple/contracts";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { PurchaseState } from "@purple/interfaces";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const { course } = await this.saga
      .rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(
        CourseGetCourse.topic,
        {
          id: this.saga.courseId
        }
      );

    if (!course) {
      throw new Error('Такого курса не существует');
    }

    if (course.price == 0) {
      this.saga.setState(PurchaseState.Purchased, course.id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga
      .rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(
        PaymentGenerateLink.topic,
        {
          courseId: course.id,
          userId: this.saga.user.id,
          sum: course.price
        }
      );

    this.saga.setState(PurchaseState.WaitingForPayment, course.id);

    return { paymentLink, user: this.saga.user };
  }

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    throw new Error("Нельзя проверить платёж, который не начался");
  }

  public async cancel(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user };
  }
}

export class BuyCourseSagaStateProcess extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Нельзя создать ссылку на оплату в процессе");
  }

  public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    const { status } = await this.saga
      .rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(
        PaymentCheck.topic,
        {
          courseId: this.saga.courseId,
          userId: this.saga.user.id
        }
      );

    switch (status) {
      case 'canceled':
        this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
        break;
      case 'success':
        this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
        break;
      case 'progress':
        /* nop */
        break;
    }

    return { user: this.saga.user, status };
  }

  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя отменить платёж в процессе");
  }
}

export class BuyCourseSagaStateFinished extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Нельзя оплатить купленный курс");
  }

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    throw new Error("Нельзя проверить платёж по купленнуму курсу");
  }

  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя отменить купленный курс");
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);

    return this.saga.getState().pay();
  }

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    throw new Error("Нельзя проверить платёж по отменённому курсу");
  }

  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя отменить отменённый курс");
  }
}
