import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import {
  RegisterDTO,
  LoginDTO,
  UserPublicDTO,
  ServiceAuthResult,
} from "../types/dtos/auth.dto";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { JwtPayloadUser } from "../types/express";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register/Signup a new user account.
   */
  async signup(dto: RegisterDTO): Promise<ServiceAuthResult> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw ApiError.conflict("Email address is already registered.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Hardcode role to "student" for public signup — never trust client input
    const newUser = await this.userRepository.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      mobileNumber: dto.mobileNumber.trim(),
      passwordHash,
      role: "student",
    });

    const userId = newUser._id.toString();
    const accessToken = this.generateAccessToken(userId, newUser.role);
    const refreshToken = this.generateRefreshToken(userId, newUser.role);

    const userPublic: UserPublicDTO = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      mobileNumber: newUser.mobileNumber,
      role: newUser.role,
    };

    return {
      user: userPublic,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate existing user with email and password.
   */
  async login(dto: LoginDTO): Promise<ServiceAuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const userId = user._id.toString();
    const accessToken = this.generateAccessToken(userId, user.role);
    const refreshToken = this.generateRefreshToken(userId, user.role);

    const userPublic: UserPublicDTO = {
      id: userId,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      role: user.role,
    };

    return {
      user: userPublic,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh JWT access token using a valid refresh token.
   */
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw ApiError.unauthorized("Refresh token is required.");
    }

    let decoded: JwtPayloadUser;
    try {
      decoded = jwt.verify(token, env.jwtRefreshSecret) as JwtPayloadUser;
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token.");
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized("Invalid or expired refresh token.");
    }

    const userId = user._id.toString();
    const newAccessToken = this.generateAccessToken(userId, user.role);

    return { accessToken: newAccessToken };
  }

  /**
   * Fetch current authenticated user details by user ID.
   */
  async getMe(userId: string): Promise<UserPublicDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.unauthorized("User account not found.");
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      role: user.role,
    };
  }

  /**
   * Helper to generate a 15-minute access token.
   */
  private generateAccessToken(userId: string, role: JwtPayloadUser["role"]): string {
    return jwt.sign({ userId, role }, env.jwtAccessSecret, {
      expiresIn: "15m",
    });
  }

  /**
   * Helper to generate a 7-day refresh token.
   */
  private generateRefreshToken(userId: string, role: JwtPayloadUser["role"]): string {
    return jwt.sign({ userId, role }, env.jwtRefreshSecret, {
      expiresIn: "7d",
    });
  }
}
