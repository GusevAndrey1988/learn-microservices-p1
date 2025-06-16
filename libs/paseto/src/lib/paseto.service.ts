import { Inject, Injectable } from "@nestjs/common";
import { PasetoModuleOptions, LocalKey, PublicKey } from "./paseto.module";
import { V3, V4 } from 'paseto';
import { PASETO_MODULE_OPTION } from "./paseto.constants";

@Injectable()
export class PasetoService {
    constructor(@Inject(PASETO_MODULE_OPTION) private readonly moduleOptions: PasetoModuleOptions) {}

    async generateToken(payload: Record<PropertyKey, unknown>) {
        const key = this.moduleOptions.key;

        if (this.isPublicKey(key)) {
            return await V4.sign(payload, key.privateKey);
        } else if (this.isLocalKey(key)) {
            return await V3.encrypt(payload, key.key);
        } else {
            throw new Error('Неизвестный тип ключа');
        }
    }

    async verifyToken(token: string) {
        const key = this.moduleOptions.key;

        if (this.isPublicKey(key)) {
            return await V4.verify(token, key.publicKey);
        } else if (this.isLocalKey(key)) {
            return await V3.decrypt(token, key.key);
        } else {
            throw new Error('Неизвестный тип ключа');
        }
    }

    async generateLocalKey(): Promise<LocalKey> {
        const key = await V3.generateKey('local', { format: 'paserk' });
        return { key };
    }

    async generatePublicKey(): Promise<PublicKey> {
        const { secretKey, publicKey } = await V4.generateKey('public', { format: 'paserk' });
        return { privateKey: secretKey, publicKey }
    }

    private isLocalKey(key: object): key is LocalKey {
        return 'key' in key;
    }

    private isPublicKey(key: object): key is PublicKey {
        return 'privateKey' in key && 'publicKey' in key;
    }
}