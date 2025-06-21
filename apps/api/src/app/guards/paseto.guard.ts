import { AuthGuard } from "@nestjs/passport";

export class PasetoAuthGuard extends AuthGuard('public-paseto') { }
