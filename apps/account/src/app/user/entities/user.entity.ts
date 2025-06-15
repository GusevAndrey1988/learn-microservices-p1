import { IUser, UserRole } from "@purple/interfaces";
import { hash, genSalt } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;

    constructor(user: IUser) {
        Object.assign(this, user);
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }
}