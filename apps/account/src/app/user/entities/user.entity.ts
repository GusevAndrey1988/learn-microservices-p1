import { IUser, IUserCourses, PurchaseState, UserRole } from "@purple/interfaces";
import { hash, genSalt, compare } from "bcryptjs";

export class UserEntity implements IUser {
  id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];

  constructor(user: IUser) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.courses = user.courses;
  }

  public addCourse(courseId: string) {
    const exist = this.courses.find(c => c.id === courseId);
    if (exist) {
      throw new Error('Добавляемый курс уже существует');
    }

    this.courses.push({
      courseId: courseId,
      purchaseState: PurchaseState.Started,
    });
  }

  public deleteCourse(courseId: string) {
    this.courses = this.courses.filter(c => c.id !== courseId);
  }

  public updateCourseStatus(courseId: string, state: PurchaseState) {
    this.courses = this.courses.map(c => {
      if (c.id === courseId) {
        c.purchaseState = state;
      }
      return c;
    });
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
