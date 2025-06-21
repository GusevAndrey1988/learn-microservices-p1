import { Controller, Get, UseGuards } from '@nestjs/common';
import { PasetoAuthGuard } from '../guards/paseto.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {
  constructor() { }

  @UseGuards(PasetoAuthGuard)
  @Get('info')
  async info(@UserId() userId: string) { }
}
