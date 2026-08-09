import React, { useRef, useState, useEffect } from 'react';
import { AuthMode } from '../../types/auth.types';
import { useAuthForm } from '../../hooks/useAuthForm';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export interface AuthCardProps {
  initialMode?: AuthMode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode = 'login' }) => {
  const {
    mode,
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
  } = useAuthForm(initialMode);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height;
        if (height > 0) {
          setContentHeight(height);
        }
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-surface-elevated">
      {/* Navigation Tabs Header */}
      <div
        role="tablist"
        aria-label="Authentication Options"
        className="relative flex border-b border-border bg-surface/30 px-4 pt-2"
      >
        <button
          type="button"
          role="tab"
          id="tab-login"
          aria-selected={mode === 'login'}
          aria-controls="panel-login"
          onClick={() => switchMode('login')}
          className={`flex-1 py-4 text-sm text-center font-medium focus:outline-none transition-colors duration-200 ${
            mode === 'login'
              ? 'text-primary font-semibold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          id="tab-signup"
          aria-selected={mode === 'signup'}
          aria-controls="panel-signup"
          onClick={() => switchMode('signup')}
          className={`flex-1 py-4 text-sm text-center font-medium focus:outline-none transition-colors duration-200 ${
            mode === 'signup'
              ? 'text-primary font-semibold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Sign Up
        </button>

        {/* Animated Sliding Active-Tab Underline Indicator */}
        <div
          className={`absolute bottom-0 h-0.5 bg-primary shadow-glow-primary transition-all duration-220 ease-out ${
            mode === 'login' ? 'left-4 w-[calc(50%-16px)]' : 'left-[50%] w-[calc(50%-16px)]'
          }`}
        />
      </div>

      {/* Form Content Body with smooth height transition */}
      <div
        className="transition-[height] duration-250 ease-out overflow-hidden"
        style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
      >
        <div ref={contentRef} className="p-7 sm:p-9">
          <div
            key={mode}
            id={mode === 'login' ? 'panel-login' : 'panel-signup'}
            role="tabpanel"
            aria-labelledby={mode === 'login' ? 'tab-login' : 'tab-signup'}
            className="animate-form-fade-in"
          >
            {mode === 'login' ? (
              <LoginForm
                formData={loginData}
                errors={errors}
                isSubmitting={isSubmitting}
                apiError={apiError}
                apiSuccessMessage={apiSuccessMessage}
                onChange={handleLoginChange}
                onSubmit={handleLoginSubmit}
              />
            ) : (
              <SignupForm
                formData={signupData}
                errors={errors}
                isSubmitting={isSubmitting}
                apiError={apiError}
                apiSuccessMessage={apiSuccessMessage}
                onChange={handleSignupChange}
                onRoleSelect={handleRoleSelect}
                onSubmit={handleSignupSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
