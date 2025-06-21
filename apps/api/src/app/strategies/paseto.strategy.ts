import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { IPasetoPayload } from "@purple/interfaces";
import { PublicPasetoStrategy, fromAuthBearer } from 'passport-paseto';

@Injectable()
export class PassetoStrategy extends PassportStrategy(PublicPasetoStrategy) {
  constructor(configService: ConfigService) {
    super({
      getToken: fromAuthBearer(),
      version: 'V4',
      publicKey: configService.get('PASETO_PUBLIC_KEY'),
    });
  }

  validate({ id }: IPasetoPayload) {
    return id;
  }
}
