import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DEMO_USER } from './data/mockData';

// TEMP: Role-based routing is currently driven by DEMO_USER.role (or URL path).
// To test Admin view vs Student view, change `role: "admin"` or `role: "student"` in src/data/mockData.ts DEMO_USER.
// Replace with real login/session determination once real authentication is wired up.

export const App: React.FC = () => {
  // Initialize current route from window location or default to landing '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Listen to browser navigation popstate (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  const handleNavigateHome = () => {
    navigateTo('/');
  };

  // Route matching based on URL path or DEMO_USER's hardcoded role when visiting dashboard routes
  const activeRole = DEMO_USER.role;

  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return (
      <AdminDashboard
        currentRole={activeRole}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard')) {
    return (
      <StudentDashboard
        currentRole={activeRole}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  // Default: Landing Page
  return <LandingPage />;
};

export default App;

