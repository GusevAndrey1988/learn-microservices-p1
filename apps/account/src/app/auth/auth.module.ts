import { Module } from '@nestjs/common';
import { PasetoModule } from '@purple/paseto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { getPasetoConfig } from '../configs/paseto.config';

@Module({
  imports: [
    UserModule,
    PasetoModule.forRootAsync(getPasetoConfig())
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
