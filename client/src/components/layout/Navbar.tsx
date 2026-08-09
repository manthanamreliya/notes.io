import React from 'react';
import { Button } from '../common/Button';
import { UserRole } from '../../types/auth.types';

export interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onNavigateDashboard?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenSignup,
  onNavigateDashboard,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
      {/* Left Logo / Wordmark */}
      <div className="flex items-center gap-4 select-none">
        <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
          Notes.io
        </span>

        {/* Dev-only role switcher in navbar */}
        {/* TEMP: Dev-only role switcher - remove once real auth/session is wired up */}
        {onNavigateDashboard && (
          <div className="hidden sm:flex items-center gap-1 bg-surface border border-border/80 rounded-lg p-1 text-xs">
            <span className="text-text-secondary/70 px-1 font-mono text-[10px] uppercase tracking-wider">
              DEV TEST:
            </span>
            <button
              type="button"
              onClick={() => onNavigateDashboard('student')}
              className="px-2 py-0.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-elevated font-medium transition-colors"
            >
              Student Dash
            </button>
            <button
              type="button"
              onClick={() => onNavigateDashboard('admin')}
              className="px-2 py-0.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-elevated font-medium transition-colors"
            >
              Admin Dash
            </button>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          fullWidth={false}
          onClick={onOpenLogin}
          aria-label="Log in"
          className="text-xs sm:text-sm px-3.5 sm:px-4 py-2"
        >
          Log in
        </Button>
        <Button
          variant="primary"
          fullWidth={false}
          onClick={onOpenSignup}
          aria-label="Sign Up"
          className="text-xs sm:text-sm px-3.5 sm:px-4 py-2"
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
};
