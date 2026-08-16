import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Fetch current user profile.
   */
  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      role: user.role,
      joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
    };
  }

  /**
   * Fetch list of users for administration dashboard.
   */
  async listUsers(skip = 0, limit = 100) {
    const users = await this.userRepository.findAll(skip, limit);
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "N/A",
      role: user.role,
      joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  }
}
