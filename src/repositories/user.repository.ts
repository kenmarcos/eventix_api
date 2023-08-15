import User from "../entities/User";

export default interface UserRepository {
  add(user: User): Promise<User>;
  verifyIfUserExists(email: string): Promise<User | undefined>;
}
