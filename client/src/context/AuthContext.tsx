import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPublic, LoginFormData, SignupFormData, AuthResponse } from '../types/auth.types';
import { loginUser, signupUser, getMe, logoutUser } from '../api/auth.api';
import { setOnUnauthenticated } from '../api/apiClient';

export interface AuthContextType {
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<AuthResponse>;
  signup: (data: SignupFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    setOnUnauthenticated(() => {
      setUser(null);
    });
  }, []);

  const handleLogin = async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await loginUser(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const handleSignup = async (data: SignupFormData): Promise<AuthResponse> => {
    const res = await signupUser(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
