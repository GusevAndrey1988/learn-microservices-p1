import { ConfigModule, ConfigService } from "@nestjs/config";
import { PasetoModuleAsyncOptions } from "@purple/paseto"

export const getPasetoConfig = (): PasetoModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        key: {
            privateKey: configService.get('PASETO_PRIVATE_KEY'),
            publicKey: configService.get('PASETO_PUBLIC_KEY')
        }
    }),
});