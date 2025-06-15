import { IUser, UserRole } from "@purple/interfaces";
import { hash, genSalt, compare } from "bcryptjs";

export class UserEntity implements IUser {
    id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;

    constructor(user: IUser) {
        this.id = user.id;
        this.displayName = user.displayName;
        this.email = user.email;
        this.passwordHash = user.passwordHash;
        this.role = user.role;
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }

    public validatePassword(password: string) {
        return compare(password, this.passwordHash);
    }
}