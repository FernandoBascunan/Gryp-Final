import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  userName: string;
  rut: string;
  email: string;
  phone: string;
  region: string;
}

interface UserData {
  id: string;
  userName: string;
  rut: string;
  email: string;
  phone: string;
  region: string;

}

export const useUserData = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          
          const userData: UserData = {
            id: decodedToken.id,
            userName: decodedToken.userName,
            rut: decodedToken.rut,
            email:decodedToken.email,
            phone: decodedToken.phone,
            region: decodedToken.region,
          };
          
          setUser(userData);
        } else {
          console.log('No se encontró token en localStorage');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setUser(null);
      }
    };

    getUserFromToken();
  }, []); 

  return user;
};

export default useUserData;