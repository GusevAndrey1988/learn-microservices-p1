import { Module } from '@nestjs/common';
import { PasetoModule } from '@purple/paseto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getPasetoConfig } from '../configs/paseto.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PasetoModule.forRootAsync(getPasetoConfig())
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
