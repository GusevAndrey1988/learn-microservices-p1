import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongoConfig()),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    RMQModule.forRootAsync(getRMQConfig())
  ],
})
export class AppModule { }
