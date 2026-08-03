import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types';
import api from '../lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void | Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const formatUser = (userData: any): UserProfile => ({
  id: userData.id || userData._id || 'usr_arena',
  name: userData.username || userData.name || 'Pro Competitor',
  email: userData.email,
  role: 'Enterprise Member & Eval Officer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  createdAt: userData.createdAt ? new Date(userData.createdAt).toISOString() : new Date().toISOString()
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('modelarena_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.user) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse auth state:', e);
      }
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get('/auth/get-me');
        if (res.data && res.data.user) {
          const validUser = formatUser(res.data.user);
          setAuthState({
            isAuthenticated: true,
            user: validUser,
          });
          localStorage.setItem('modelarena_auth', JSON.stringify({ isAuthenticated: true, user: validUser }));
        }
      } catch (error) {
        // No active session or token expired
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
        localStorage.removeItem('modelarena_auth');
      }
    };
    verifySession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password: pass });
      if (response.data && response.data.user) {
        const loggedInUser = formatUser(response.data.user);
        setAuthState({
          isAuthenticated: true,
          user: loggedInUser,
        });
        localStorage.setItem('modelarena_auth', JSON.stringify({ isAuthenticated: true, user: loggedInUser }));
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.err || err.message || 'Authentication error occurred.';
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', { username: name, email, password: pass });
      if (response.data && response.data.user) {
        const newUser = formatUser(response.data.user);
        setAuthState({
          isAuthenticated: true,
          user: newUser,
        });
        localStorage.setItem('modelarena_auth', JSON.stringify({ isAuthenticated: true, user: newUser }));
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout network call failed:', e);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      localStorage.removeItem('modelarena_auth');
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!authState.user) return;
    const updatedUser = { ...authState.user, ...updates };
    setAuthState({
      isAuthenticated: true,
      user: updatedUser,
    });
    localStorage.setItem('modelarena_auth', JSON.stringify({ isAuthenticated: true, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
