import React from 'react';
import { Button } from '../common/Button';

export interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenSignup,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
      {/* Left Logo / Wordmark */}
      <div className="flex items-center gap-2 sm:gap-4 select-none shrink-0">
        <span className="text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
          Notes.io
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant="secondary"
          fullWidth={false}
          onClick={onOpenLogin}
          aria-label="Log in"
          className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
        >
          Log in
        </Button>
        <Button
          variant="primary"
          fullWidth={false}
          onClick={onOpenSignup}
          aria-label="Sign Up"
          className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
};
