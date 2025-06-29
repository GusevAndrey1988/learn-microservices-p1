import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@purple/interfaces";
import { hash, genSalt, compare } from "bcryptjs";

export class UserEntity implements IUser {
  id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find(c => c.courseId === courseId);
    if (!exist) {
      this.courses.push({
        courseId,
        purchaseState: state,
      })
      return this;
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter(c => c.courseId !== courseId);
      return this;
    }

    this.courses = this.courses.map(c => {
      if (c.courseId === courseId) {
        c.purchaseState = state;
      }
      return c;
    });

    this.events.push()

    return this;
  }

  public getCourseState(courseId: string): PurchaseState {
    return this.courses.find(c => c.courseId === courseId)?.purchaseState ?? PurchaseState.Started;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    }
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
