import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple/interfaces';
import { PasetoService } from '@purple/paseto';
import { UserRepository } from '../user/repositories/user.repository';
import { AccountRegister } from '@purple/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly pasetoService: PasetoService
  ) { }

  async register({ email, password, displayName }: AccountRegister.Request) {
    const oldUser = await this.userRepository.findUser(email);
    if (oldUser) {
      throw new Error('Такой пользователь уже зарегистрирован');
    }

    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    const userEntity = new UserEntity(user);

    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new Error('Неверный логин или пароль');
    }

    return { id: user.id };
  }

  async login(id: string) {
    return {
      access_token: await this.pasetoService.generateToken({ id })
    }
  }
}
