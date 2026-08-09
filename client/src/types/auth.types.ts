export type AuthMode = 'login' | 'signup';
export type UserRole = 'admin' | 'student';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole | null;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;
export type FormErrors = Record<string, string | undefined>;

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role?: UserRole;
  };
  token?: string;
}

/**
 * Placeholder async login API function to hit backend endpoint.
 */
export async function loginUser(data: LoginFormData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('[API Placeholder] loginUser called with:', { email: data.email });

  return {
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token-12345',
    user: {
      id: 'usr_1',
      email: data.email,
    },
  };
}

/**
 * Placeholder async signup API function to hit backend endpoint.
 */
export async function signupUser(data: SignupFormData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('[API Placeholder] signupUser called with:', {
    name: data.name,
    email: data.email,
    role: data.role,
  });

  return {
    success: true,
    message: 'Account created successfully',
    token: 'mock-jwt-token-67890',
    user: {
      id: 'usr_2',
      name: data.name,
      email: data.email,
      role: data.role || undefined,
    },
  };
}
