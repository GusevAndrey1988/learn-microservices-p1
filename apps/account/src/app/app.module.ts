import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongoConfig()),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' })
  ],
})
export class AppModule { }
