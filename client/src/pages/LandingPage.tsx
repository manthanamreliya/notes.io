import React, { useState } from 'react';
import { AuthMode } from '../types/auth.types';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { ValueProps } from '../components/landing/ValueProps';
import { AuthModal } from '../components/auth/AuthModal';

export interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
      />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col justify-center">
        <Hero onOpenSignup={handleOpenSignup} />
        <ValueProps />
      </main>

      {/* Footer copyright note */}
      <footer className="w-full py-8 text-center border-t border-border/40 bg-background text-xs text-text-secondary">
        &copy; {new Date().getFullYear()} Engineering Notes. All rights reserved.
      </footer>

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        initialMode={authMode}
      />
    </div>
  );
};
