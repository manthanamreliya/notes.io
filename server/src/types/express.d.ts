import { UserRole } from "../models/User.model";

export interface JwtPayloadUser {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}

