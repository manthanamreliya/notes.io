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
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
      {/* Left Logo / Wordmark */}
      <div className="flex items-center gap-4 select-none">
        <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
          Notes.io
        </span>
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
