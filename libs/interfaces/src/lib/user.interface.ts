export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student'
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled'
}

export interface IUser {
  id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
}

export interface IUserCourses {
  courseId: string;
  purchaseState: PurchaseState;
}
