import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export interface DashboardHeaderProps {
  onNavigateHome?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNavigateHome }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const displayName = user?.name || user?.email || 'User';
  const role = user?.role || 'student';

  return (
    <header className="w-full bg-surface-elevated border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 select-none group text-left focus:outline-none"
            title="Go to Landing Page"
          >
            <span className="text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Notes.io
            </span>
          </button>
        </div>

        {/* Right: User Info, Role Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 text-right">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-text-primary truncate max-w-[110px] sm:max-w-[180px]">
                {displayName}
              </span>
              {role === 'admin' && (
                <Badge className="bg-primary/15 text-primary border-primary/40 text-[10px] py-0.5 px-1.5 sm:px-2 shrink-0">
                  Admin
                </Badge>
              )}
              {role === 'student' && (
                <Badge className="bg-surface border-border text-text-secondary text-[10px] py-0.5 px-1.5 sm:px-2 shrink-0">
                  Student
                </Badge>
              )}
            </div>

            <Button
              variant="secondary"
              fullWidth={false}
              onClick={handleLogout}
              className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 border-border/80 text-text-secondary hover:text-text-primary hover:border-primary/50 shrink-0"
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
