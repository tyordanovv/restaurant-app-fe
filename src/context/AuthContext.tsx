import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from "axios";

interface LoginCredentials {
    email: string;
    password: string;
}
  
interface RegistrationCredentials extends LoginCredentials {
    username: string;
}
  
interface User {
    id: string;
    username: string;
    email: string;
    // Add other user fields as needed
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegistrationCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
  
    // Check authentication status on initial load
    useEffect(() => {
      checkAuthStatus();
    }, []);
  
    // Check current authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3011/auth/me', {
          withCredentials: true // Important for cookie-based auth
        });
        
        if (response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
  
    // Login method
    const login = async (credentials: LoginCredentials) => {
      try {
        const response = await axios.post('http://localhost:3011/auth/login', credentials, {
          withCredentials: true
        });
  
        if (response.data) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error: any) {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    };
  
    // Registration method
    const register = async (credentials: RegistrationCredentials) => {
      try {
        const response = await axios.post('http://localhost:3011/auth/register', credentials, {
          withCredentials: true // Ensures cookies are sent and stored
        });
  
        if (response.data) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error: any) {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    };
  
    // Logout method
    const logout = async () => {
      try {
        await axios.post('http://localhost:3011/auth/logout', {}, {
          withCredentials: true
        });
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
  
    return (
      <AuthContext.Provider value={{ 
        isAuthenticated, 
        user, 
        login, 
        register, 
        logout 
      }}>
        {children}
      </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};