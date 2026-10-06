import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  title?: string;
  profile?: any;
  enrollments?: any[];
  certificates?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string, isAdmin?: boolean) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<{ requiresEmailVerification: boolean; email: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cadelibora_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    if (!localStorage.getItem('cadelibora_token')) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetchApi<{ success: boolean; user: UserProfile }>('/auth/me');
      if (res.success) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to load current user', err);
      localStorage.removeItem('cadelibora_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

 const login = async (
   identifier: string,
   password: string,
   isAdmin = false
 ) => {
   const res = await fetchApi<{
     success: boolean;
     token: string;
     user: UserProfile;
   }>('/auth/login', {
     method: 'POST',
     body: JSON.stringify(
       isAdmin
         ? { username: identifier, password }
         : { email: identifier, password }
     ),
   });

   if (res.success) {
     localStorage.setItem('cadelibora_token', res.token);
     setToken(res.token);
     setUser(res.user);
   }
 };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    role = 'STUDENT'
  ): Promise<{ requiresEmailVerification: boolean; email: string }> => {
    const res = await fetchApi<{
      success: boolean;
      message: string;
      requiresEmailVerification?: boolean;
      user: UserProfile;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role }),
    });

    if (!res.success) {
      throw new Error(res.message || 'Registration failed');
    }

    return {
      requiresEmailVerification: res.requiresEmailVerification ?? false,
      email: res.user.email,
    };
  };

const verifyEmail = async (email: string, code: string): Promise<void> => {
  const res = await fetchApi<{
    success: boolean;
    message: string;
    token?: string;
    user?: UserProfile;
  }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });

  if (!res.success || !res.token || !res.user) {
    throw new Error(res.message || 'Email verification failed');
  }

  localStorage.setItem('cadelibora_token', res.token);
  setToken(res.token);
  setUser(res.user);
};

  const logout = () => {
    localStorage.removeItem('cadelibora_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyEmail,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
