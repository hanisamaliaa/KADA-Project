import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import type { AuthUser } from '@/types';

// Define the types for the context value
interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  adminSignIn: (username: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // THIS IS FRONTEND MOCK AUTHENTICATION ONLY.
  // The persisted value is harmless demo state, not secure authentication.
  // Students must replace this with backend auth, password hashing, JWT/cookies,
  // auth middleware, protected routes, and admin authorization.
  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password);
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const adminSignIn = async (username: string, password: string) => {
    try {
      const user = await authService.adminLogin(username, password);
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await authService.register(email, password, fullName);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };


  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    adminSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
