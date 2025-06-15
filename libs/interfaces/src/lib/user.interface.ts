export enum UserRole {
    Teacher = 'Teacher',
    Student = 'Student'
}

export interface IUser {
    _id?: unknown;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}