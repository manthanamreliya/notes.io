export type AuthMode = 'login' | 'signup';
export type UserRole = 'admin' | 'student';

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;
export type FormErrors = Record<string, string | undefined>;

export interface AuthResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    user: UserPublic;
  };
  errors?: string[];
}
