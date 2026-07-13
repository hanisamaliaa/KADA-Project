import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  adminSignIn: (username: string, password: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const stored = authService.getStoredUser();
      if (stored) {
        try {
          const freshUser = await authService.getCurrentUser();
          if (freshUser) {
            setUser(freshUser);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      return { error: new Error(message) };
    }
  }, []);

  const adminSignIn = useCallback(async (username: string, password: string) => {
    try {
      const userData = await authService.adminLogin(username, password);
      setUser(userData);
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Invalid admin credentials';
      return { error: new Error(message) };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const data = await authService.register(email, password, fullName);
      // NOTE: registration does NOT log the user in — they must verify their email first.
      return { error: null, data };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { error: new Error(message) };
    }
  }, []);

  // Re-read the current user from the server (used after email verification, which
  // sets the auth cookies).
  const refreshUser = useCallback(async () => {
    setUser(await authService.getCurrentUser());
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    adminSignIn,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
