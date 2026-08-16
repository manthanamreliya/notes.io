import { UserRole } from "../../models/User.model";

export interface RegisterDTO {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserPublicDTO {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  joinedDate?: string;
}


export interface AuthResponseDTO {
  user: UserPublicDTO;
}

export interface ServiceAuthResult {
  user: UserPublicDTO;
  accessToken: string;
  refreshToken: string;
}
