
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "@/components/ui/sonner";

type UserRole = 'consumer' | 'provider' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isConsumer: boolean;
  isProvider: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock users for demonstration
  const mockUsers = {
    consumer: {
      id: 'consumer-1',
      name: 'John Doe',
      email: 'consumer@example.com',
      role: 'consumer' as UserRole,
      password: 'password123'
    },
    provider: {
      id: 'provider-1',
      name: 'Hotel Manager',
      email: 'provider@example.com',
      role: 'provider' as UserRole,
      password: 'password123'
    }
  };

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('hotelquick_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate a login API call
    try {
      // Delayed response to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      let mockUser;
      if (role === 'consumer') {
        mockUser = mockUsers.consumer;
      } else if (role === 'provider') {
        mockUser = mockUsers.provider;
      }
      
      if (!mockUser || mockUser.email !== email || mockUser.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = mockUser;
      
      // Save to local storage
      localStorage.setItem('hotelquick_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('hotelquick_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = user !== null;
  const isConsumer = user?.role === 'consumer';
  const isProvider = user?.role === 'provider';

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        isConsumer,
        isProvider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
