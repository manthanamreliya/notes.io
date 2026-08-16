import { apiClient } from './apiClient';
import {
  LoginFormData,
  SignupFormData,
  AuthResponse,
} from '../types/auth.types';
import { AxiosError } from 'axios';

/**
 * Handle API error parsing from backend ApiError responses.
 */
function handleApiError(err: unknown): AuthResponse {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as {
      success?: boolean;
      statusCode?: number;
      message?: string;
      errors?: string[];
    };
    return {
      success: false,
      statusCode: data.statusCode || err.response.status,
      message: data.message || 'An error occurred during authentication.',
      errors: data.errors || [],
    };
  }
  return {
    success: false,
    message: err instanceof Error ? err.message : 'Network error. Please try again.',
  };
}

/**
 * POST /api/auth/login
 */
export async function loginUser(data: LoginFormData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: data.email.trim(),
      password: data.password,
    });
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/auth/signup
 */
export async function signupUser(data: SignupFormData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/signup', {
      name: data.name.trim(),
      email: data.email.trim(),
      mobileNumber: data.mobileNumber.trim(),
      password: data.password,
    });
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/logout');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}
