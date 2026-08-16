import { UserModel, IUser } from "../models/User.model";

export class UserRepository {
  /**
   * Find a user by email address (case-insensitive).
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  /**
   * Find a user by primary key ID.
   */
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  /**
   * Create a new user document.
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  /**
   * List users with optional limit/skip pagination.
   */
  async findAll(skip = 0, limit = 20): Promise<IUser[]> {
    return UserModel.find().skip(skip).limit(limit).exec();
  }
}
