import React, { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { SignupFormData, FormErrors } from '../../types/auth.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface SignupFormProps {
  formData: SignupFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  apiSuccessMessage: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isFormValid?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  errors,
  isSubmitting,
  apiError,
  apiSuccessMessage,
  onChange,
  onBlur,
  onSubmit,
  isFormValid = false,
}) => {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3.5">
      {apiSuccessMessage && (
        <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
          {apiSuccessMessage}
        </div>
      )}

      {apiError && (
        <div role="alert" className="p-3.5 rounded-lg bg-error/10 border border-error/30 text-error text-xs font-medium">
          {apiError}
        </div>
      )}

      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="Alex Morgan"
        autoComplete="name"
        value={formData.name}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.name}
      />

      <Input
        label="Email address"
        id="email"
        type="email"
        placeholder="alex@example.com"
        autoComplete="email"
        value={formData.email}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
      />

      <Input
        label="Mobile Number"
        id="mobileNumber"
        type="tel"
        placeholder="10-digit mobile number"
        autoComplete="tel"
        value={formData.mobileNumber}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.mobileNumber}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        value={formData.password}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        placeholder="Re-enter password"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.confirmPassword}
      />

      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          className="shadow-glow-primary hover:shadow-glow-primary-lg py-2.5 font-semibold text-sm"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};
