import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { PasetoModule } from '@purple/paseto';
import { getPasetoConfig } from './configs/paseto.config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    PasetoModule.forRootAsync(getPasetoConfig()),
    PassportModule
  ],
  controllers: [AuthController, UserController]
})
export class AppModule { }
