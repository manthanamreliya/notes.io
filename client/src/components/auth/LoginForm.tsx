import React, { ChangeEvent, FormEvent } from 'react';
import { LoginFormData, FormErrors } from '../../types/auth.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface LoginFormProps {
  formData: LoginFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  apiSuccessMessage: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  isSubmitting,
  apiError,
  apiSuccessMessage,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
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
        label="Email address"
        id="email"
        type="email"
        placeholder="alex@example.com"
        autoComplete="email"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={formData.password}
        onChange={onChange}
        error={errors.password}
      />

      <div className="pt-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="shadow-glow-primary hover:shadow-glow-primary-lg py-3 font-semibold text-sm"
        >
          Login
        </Button>
      </div>
    </form>
  );
};
