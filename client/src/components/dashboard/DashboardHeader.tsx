import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { DEMO_USER } from '../../data/mockData';
import { UserRole } from '../../types/auth.types';

export interface DashboardHeaderProps {
  currentRole?: UserRole;
  onNavigateHome: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentRole = DEMO_USER.role,
  onNavigateHome,
}) => {
  return (
    <header className="w-full bg-surface-elevated border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 select-none group text-left focus:outline-none"
            title="Go to Landing Page"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Notes.io
            </span>
          </button>
        </div>

        {/* Right: User Info, Role Badge & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-text-primary">
                {DEMO_USER.username}
              </span>
              {currentRole === 'admin' && (
                <Badge className="bg-primary/15 text-primary border-primary/40 text-[10px] py-0.5 px-2">
                  Admin
                </Badge>
              )}
            </div>

            <Button
              variant="secondary"
              fullWidth={false}
              onClick={onNavigateHome}
              className="text-xs px-3 py-1.5 h-8 border-border/80 text-text-secondary hover:text-text-primary hover:border-primary/50"
              title="Logout (Return to home)"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

