export enum UserRole {
    Teacher = 'Teacher',
    Student = 'Student'
}

export interface IUser {
    id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}