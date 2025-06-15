import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../user/models/user.model";
import { DeleteResult, Model } from "mongoose";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async create(user: UserEntity): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async findUser(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async deleteUser(email: string): Promise<DeleteResult> {
        return this.userModel.deleteOne({ email }).exec();
    }
}
