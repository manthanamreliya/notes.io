import { useState, useEffect, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthMode,
  LoginFormData,
  SignupFormData,
  LoginFormErrors,
  SignupFormErrors,
  FormErrors,
} from '../types/auth.types';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_STRENGTH_REGEX = /^(?=.*[A-Za-z])(?=.*\d)/;

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
  handleSignupBlur: (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleSignupSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  switchMode: (newMode: AuthMode) => void;
  isSignupValid: boolean;
}

export function useAuthForm(initialMode: AuthMode = 'login'): UseAuthFormReturn {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setModeState] = useState<AuthMode>(initialMode);

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [touchedSignupFields, setTouchedSignupFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setModeState(initialMode);
    setErrors({});
    setTouchedSignupFields({});
    setApiError(null);
    setApiSuccessMessage(null);
  }, [initialMode]);

  const switchMode = (newMode: AuthMode) => {
    setModeState(newMode);
    setErrors({});
    setTouchedSignupFields({});
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

  const validateSignupSingleField = (
    fieldName: keyof SignupFormData,
    value: string,
    currentData: SignupFormData
  ): string | undefined => {
    switch (fieldName) {
      case 'name': {
        const trimmed = value.trim();
        if (!trimmed) return 'Full name is required.';
        if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
        return undefined;
      }
      case 'email': {
        const trimmed = value.trim();
        if (!trimmed) return 'Email address is required.';
        if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
        return undefined;
      }
      case 'mobileNumber': {
        const trimmed = value.trim();
        if (!trimmed) return 'Mobile number is required.';
        if (!MOBILE_REGEX.test(trimmed)) return 'Mobile number must be a valid 10-digit number.';
        return undefined;
      }
      case 'password': {
        if (!value) return 'Password is required.';
        if (value.length < MIN_PASSWORD_LENGTH) {
          return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
        }
        if (!PASSWORD_STRENGTH_REGEX.test(value)) {
          return 'Password must contain at least one letter and one number.';
        }
        return undefined;
      }
      case 'confirmPassword': {
        if (!value) return 'Please confirm your password.';
        if (value !== currentData.password) return 'Passwords do not match.';
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SignupFormData;
    const updatedData = { ...signupData, [fieldName]: value };
    setSignupData(updatedData);

    if (apiError) setApiError(null);

    // Re-validate field live if it was touched or currently displays an error
    if (touchedSignupFields[fieldName] || errors[fieldName]) {
      const fieldError = validateSignupSingleField(fieldName, value, updatedData);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }

    // If password is updated, re-validate confirmPassword if touched/filled/errored
    if (
      fieldName === 'password' &&
      (touchedSignupFields.confirmPassword || errors.confirmPassword || updatedData.confirmPassword)
    ) {
      const confirmError = validateSignupSingleField('confirmPassword', updatedData.confirmPassword, updatedData);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  const handleSignupBlur = (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SignupFormData;
    setTouchedSignupFields((prev) => ({ ...prev, [fieldName]: true }));

    const fieldError = validateSignupSingleField(fieldName, value, signupData);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));
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

    const nameErr = validateSignupSingleField('name', data.name, data);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateSignupSingleField('email', data.email, data);
    if (emailErr) newErrors.email = emailErr;

    const mobileErr = validateSignupSingleField('mobileNumber', data.mobileNumber, data);
    if (mobileErr) newErrors.mobileNumber = mobileErr;

    const passErr = validateSignupSingleField('password', data.password, data);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateSignupSingleField('confirmPassword', data.confirmPassword, data);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

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
      const response = await login(loginData);
      if (response.success && response.data?.user) {
        setApiSuccessMessage(response.message || 'Login successful!');
        const targetPath = response.data.user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(targetPath, { replace: true });
      } else {
        setApiError(response.message || 'Login failed. Please try again.');
        if (response.errors && response.errors.length > 0) {
          const fieldErrs: FormErrors = {};
          response.errors.forEach((msg) => {
            if (msg.toLowerCase().includes('email')) fieldErrs.email = msg;
            if (msg.toLowerCase().includes('password')) fieldErrs.password = msg;
          });
          if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs);
        }
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
      setTouchedSignupFields({
        name: true,
        email: true,
        mobileNumber: true,
        password: true,
        confirmPassword: true,
      });
      setErrors(validationErrors as FormErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload: SignupFormData = {
      name: signupData.name.trim(),
      email: signupData.email.trim().toLowerCase(),
      mobileNumber: signupData.mobileNumber.trim(),
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
    };

    try {
      const response = await signup(payload);
      if (response.success && response.data?.user) {
        setApiSuccessMessage(response.message || 'Account created successfully!');
        const targetPath = response.data.user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(targetPath, { replace: true });
      } else {
        setApiError(response.message || 'Signup failed. Please try again.');
        if (response.errors && response.errors.length > 0) {
          const fieldErrs: FormErrors = {};
          response.errors.forEach((msg) => {
            if (msg.toLowerCase().includes('name')) fieldErrs.name = msg;
            if (msg.toLowerCase().includes('email')) fieldErrs.email = msg;
            if (msg.toLowerCase().includes('mobile')) fieldErrs.mobileNumber = msg;
            if (msg.toLowerCase().includes('password')) fieldErrs.password = msg;
          });
          if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs);
        }
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignupValid =
    Boolean(signupData.name.trim()) &&
    signupData.name.trim().length >= 2 &&
    Boolean(signupData.email.trim()) &&
    EMAIL_REGEX.test(signupData.email.trim()) &&
    Boolean(signupData.mobileNumber.trim()) &&
    MOBILE_REGEX.test(signupData.mobileNumber.trim()) &&
    Boolean(signupData.password) &&
    signupData.password.length >= MIN_PASSWORD_LENGTH &&
    PASSWORD_STRENGTH_REGEX.test(signupData.password) &&
    Boolean(signupData.confirmPassword) &&
    signupData.confirmPassword === signupData.password &&
    !errors.name &&
    !errors.email &&
    !errors.mobileNumber &&
    !errors.password &&
    !errors.confirmPassword;

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
    handleSignupBlur,
    handleLoginSubmit,
    handleSignupSubmit,
    switchMode,
    isSignupValid,
  };
}
