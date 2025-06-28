import { Injectable } from '@nestjs/common';
import { IUser } from '@purple/interfaces';
import { UserRepository } from './repositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmitter } from './user.event-emitter';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventsEmitter: UserEventEmitter
  ) { }

  public async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existedUser = await this.userRepository.findUserById(id);
    if (!existedUser) {
      throw new Error('Такого пользователя не существует');
    }

    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);

    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const userEntity = await this.getUser(userId);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    const { user, paymentLink } = await saga.getState().pay();

    await this.updateUser(user);

    return { paymentLink }
  }

  public async checkPayment(userId: string, courseId: string) {
    const userEntity = await this.getUser(userId);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    const { user, status } = await saga.getState().checkPayment();

    await this.updateUser(user);

    return { status };
  }

  private async getUser(userId: string) {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser) {
      throw new Error('Такого пользователя нет');
    }

    return new UserEntity(existedUser);
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventsEmitter.handle(user),
      this.userRepository.updateUser(user)
    ]);
  }
}
