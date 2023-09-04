import mongoose from "mongoose";
import User from "../entities/User";
import UserRepository from "./user.repository";

const userchema = new mongoose.Schema({
  name: String,
  email: String,
});

const UserModel = mongoose.model("User", userchema);

export class UserRepositoryMongoose implements UserRepository {
  async add(user: User): Promise<User> {
    const userModel = new UserModel(user);

    const newUser = await userModel.save();

    return newUser.toObject();
  }

  async verifyIfUserExists(email: string): Promise<User | undefined> {
    const result = await UserModel.findOne({ email }).exec();

    return result ? result.toObject() : undefined;
  }
}
