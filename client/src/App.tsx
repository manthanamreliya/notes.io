import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserRole } from './types/auth.types';
import { DEMO_USER } from './data/mockData';

// TEMP: remove once real auth/session is wired up
console.log('[Dev Auth Bypass] Active demo user:', DEMO_USER);

export const App: React.FC = () => {
  // Initialize current route from window location or default to landing '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Active demo role ('student' | 'admin')
  const [demoRole, setDemoRole] = useState<UserRole>(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'student';
  });

  // Listen to browser navigation popstate (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/admin')) {
        setDemoRole('admin');
      } else if (path.startsWith('/dashboard')) {
        setDemoRole('student');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, role?: UserRole) => {
    const targetRole = role || (path.startsWith('/admin') ? 'admin' : 'student');
    setDemoRole(targetRole);
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const targetPath = newRole === 'admin' ? '/admin' : '/dashboard';
    navigateTo(targetPath, newRole);
  };

  const handleNavigateHome = () => {
    navigateTo('/');
  };

  // Route matching
  if (currentPath === '/admin' || (currentPath.startsWith('/admin') && demoRole === 'admin')) {
    return (
      <AdminDashboard
        currentRole={demoRole}
        onSwitchRole={handleSwitchRole}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard') || demoRole === 'student' && currentPath !== '/') {
    return (
      <StudentDashboard
        currentRole={demoRole}
        onSwitchRole={handleSwitchRole}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  // Default: Landing Page with dev access to dashboards
  return (
    <LandingPage
      onNavigateDashboard={(role) => {
        const path = role === 'admin' ? '/admin' : '/dashboard';
        navigateTo(path, role);
      }}
    />
  );
};

export default App;
