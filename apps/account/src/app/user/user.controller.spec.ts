import { Test, TestingModule } from '@nestjs/testing';
import { getMongoConfig } from '../configs/mongo.config';
import { UserModule } from './user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { AccountBuyCourse, AccountLogin, AccountRegister, AccountUserInfo, CourseGetCourse, PaymentGenerateLink } from '@purple/contracts';
import { AuthModule } from '../auth/auth.module';
import { V4 } from 'paseto';

const authLogin: AccountLogin.Request = {
  email: 'b@b.ru',
  password: '2',
};

const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'Smith',
};

const courseId = 'courseId';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let configService: ConfigService;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../envs/.account.env' }),
        UserModule,
        AuthModule,
        MongooseModule.forRootAsync(getMongoConfig()),
        RMQModule.forTest({})
      ],
    }).compile();

    app = module.createNestApplication();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    configService = app.get<ConfigService>(ConfigService);

    await app.init();

    await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(
      AccountRegister.topic,
      authRegister
    );

    const { access_token } = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
      AccountLogin.topic,
      authLogin
    );
    token = access_token;

    const data = await V4.verify(token, configService.get('PASETO_PUBLIC_KEY'));
    userId = data.id as string;
  });

  it('AccountUserInfo', async () => {
    const res = await rmqService.triggerRoute<AccountUserInfo.Request, AccountUserInfo.Response>(
      AccountUserInfo.topic,
      {
        id: userId,
      }
    );

    expect(res.profile.displayName).toEqual(authRegister.displayName);
  });

  it('BuyCourse', async () => {
    const paymentLink = 'paymentLink';

    rmqService.mockReply<CourseGetCourse.Response>(CourseGetCourse.topic, {
      course: {
        id: courseId,
        price: 1000,
      }
    });

    rmqService.mockReply<PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      paymentLink
    });

    const res = await rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(
      AccountBuyCourse.topic,
      {
        courseId,
        userId
      }
    );

    expect(res.paymentLink).toEqual(paymentLink);

    await expect(
      rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(
        AccountBuyCourse.topic,
        {
          courseId,
          userId
        }
      )
    ).rejects.toThrow();
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    app.close();
  });
});
