import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for "Sign in with Google"
const MOCK_USER: UserProfile = {
  uid: 'mock-user-123',
  displayName: 'Cidadão Baturité',
  email: 'cidadao.baturite@email.com',
  photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Cidadão%20Baturité`,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const guestStatus = sessionStorage.getItem('isGuest');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsGuest(false);
      } else if (guestStatus === 'true') {
        setIsGuest(true);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setUser(MOCK_USER);
    setIsGuest(false);
    sessionStorage.setItem('user', JSON.stringify(MOCK_USER));
    sessionStorage.removeItem('isGuest');
    setLoading(false);
  };

  const signInAsGuest = () => {
    setLoading(true);
    setUser(null);
    setIsGuest(true);
    sessionStorage.removeItem('user');
    sessionStorage.setItem('isGuest', 'true');
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    setIsGuest(false);
    sessionStorage.clear();
    setLoading(false);
  };
  
  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedUser = {
        ...prevUser,
        displayName: updates.displayName ?? prevUser.displayName,
        photoURL: updates.photoURL ?? prevUser.photoURL,
      };
      
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = { user, loading, isGuest, signInWithGoogle, signInAsGuest, logout, updateUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};