import React, { ChangeEvent, FormEvent } from 'react';
import { SignupFormData, FormErrors, UserRole } from '../../types/auth.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface SignupFormProps {
  formData: SignupFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  apiSuccessMessage: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRoleSelect: (role: UserRole) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  errors,
  isSubmitting,
  apiError,
  apiSuccessMessage,
  onChange,
  onRoleSelect,
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
        label="Full Name"
        id="name"
        type="text"
        placeholder="Alex Morgan"
        autoComplete="name"
        value={formData.name}
        onChange={onChange}
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
        error={errors.email}
      />

      {/* Role Selector Field */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none">
          I am a
        </label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="I am a">
          <button
            type="button"
            role="radio"
            aria-checked={formData.role === 'student'}
            onClick={() => onRoleSelect('student')}
            className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
              formData.role === 'student'
                ? 'bg-primary text-white border-primary shadow-glow-primary font-semibold'
                : 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary font-medium'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={formData.role === 'admin'}
            onClick={() => onRoleSelect('admin')}
            className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
              formData.role === 'admin'
                ? 'bg-primary text-white border-primary shadow-glow-primary font-semibold'
                : 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary font-medium'
            }`}
          >
            Admin
          </button>
        </div>
        {errors.role && (
          <p role="alert" className="text-xs text-error mt-1.5 font-medium">
            {errors.role}
          </p>
        )}
      </div>

      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        value={formData.password}
        onChange={onChange}
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
        error={errors.confirmPassword}
      />

      <div className="pt-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="shadow-glow-primary hover:shadow-glow-primary-lg py-3 font-semibold text-sm"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};
