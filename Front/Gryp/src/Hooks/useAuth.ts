import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../Services/authService';

interface Usuario {
  id: number;
  email: string;
  name: string;
  location: string;
  phone: string;
  rut: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const isValid = await AuthService.validateToken(token);
        
        if (isValid) {
          const userProfile = await AuthService.getUserProfile(token);
          setUserData(userProfile);
          setIsAuthenticated(true);
        } else {
          await logout();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        await logout();
      }
    }
    
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
    history.push('/iniciarsesion');
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('authToken');
    if (token && isAuthenticated) {
      try {
        const userProfile = await AuthService.getUserProfile(token);
        setUserData(userProfile);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  return {
    isAuthenticated,
    userData,
    loading,
    logout,
    checkAuth,
    refreshUserData
  };
};