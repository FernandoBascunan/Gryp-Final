interface LoginResponse {
    token: string;
    usuario: Usuario;
  }
  
  interface Usuario {
    id: number;
    email: string;
    name: string;
    location: string;
    phone: string;
    rut: string;
  }
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
  
  export class AuthService {
    static async login(email: string, password: string): Promise<LoginResponse> {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error en el inicio de sesión');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }
  
    static async validateToken(token: string): Promise<boolean> {
      try {
        const response = await fetch(`${API_URL}/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        return response.ok;
      } catch {
        return false;
      }
    }
  
    static async getUserProfile(token: string): Promise<Usuario> {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
      }
  
      return response.json();
    }
  }