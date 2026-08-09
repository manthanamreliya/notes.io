import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  AuthMode,
  UserRole,
  LoginFormData,
  SignupFormData,
  LoginFormErrors,
  SignupFormErrors,
  FormErrors,
  loginUser,
  signupUser,
  AuthResponse,
} from '../types/auth.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface UseAuthFormReturn {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  loginData: LoginFormData;
  signupData: SignupFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  apiSuccessMessage: string | null;
  handleLoginChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSignupChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRoleSelect: (role: UserRole) => void;
  handleLoginSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleSignupSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  switchMode: (newMode: AuthMode) => void;
}

export function useAuthForm(initialMode: AuthMode = 'login'): UseAuthFormReturn {
  const [mode, setModeState] = useState<AuthMode>(initialMode);

  useEffect(() => {
    setModeState(initialMode);
    setErrors({});
    setApiError(null);
    setApiSuccessMessage(null);
  }, [initialMode]);

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);

  const switchMode = (newMode: AuthMode) => {
    setModeState(newMode);
    setErrors({});
    setApiError(null);
    setApiSuccessMessage(null);
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSignupData((prev) => ({ ...prev, role }));

    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!data.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!data.password) {
      newErrors.password = 'Password is required.';
    } else if (data.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    return newErrors;
  };

  const validateSignupForm = (data: SignupFormData): SignupFormErrors => {
    const newErrors: SignupFormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!data.role) {
      newErrors.role = 'Please select a role.';
    }

    if (!data.password) {
      newErrors.password = 'Password is required.';
    } else if (data.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccessMessage(null);

    const validationErrors = validateLoginForm(loginData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as FormErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response: AuthResponse = await loginUser(loginData);
      if (response.success) {
        setApiSuccessMessage(response.message || 'Login successful!');
      } else {
        setApiError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccessMessage(null);

    const validationErrors = validateSignupForm(signupData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as FormErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response: AuthResponse = await signupUser(signupData);
      if (response.success) {
        setApiSuccessMessage(response.message || 'Account created successfully!');
      } else {
        setApiError(response.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mode,
    setMode: setModeState,
    loginData,
    signupData,
    errors,
    isSubmitting,
    apiError,
    apiSuccessMessage,
    handleLoginChange,
    handleSignupChange,
    handleRoleSelect,
    handleLoginSubmit,
    handleSignupSubmit,
    switchMode,
  };
}
