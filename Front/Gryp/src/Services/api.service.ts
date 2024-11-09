
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface LoginResponse {
  message: string;
  user: User;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly PHP_API_URL = 'http://localhost/your-php-folder';

  // Autenticación con tipo específico para la respuesta del login
  async login(credentials: LoginCredentials): Promise<LoginResponse | { error: string }> {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }
      
      return data as LoginResponse;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
  
    // Operaciones CRUD genéricas
    async getAll<T>(table: string): Promise<ApiResponse<T[]>> {
      try {
        const response = await fetch(`${this.PHP_API_URL}?table=${table}&operation=GET_ALL`);
        const data = await response.json();
        return { data };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Error al obtener datos',
        };
      }
    }
  
    async getOne<T>(table: string, id: number): Promise<ApiResponse<T>> {
      try {
        const response = await fetch(`${this.PHP_API_URL}?table=${table}&operation=GET_ONE&id=${id}`);
        const data = await response.json();
        return { data };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Error al obtener el registro',
        };
      }
    }
  
    async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
      try {
        const response = await fetch(`${this.PHP_API_URL}?table=${table}&operation=CREATE`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        return { data: result };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Error al crear el registro',
        };
      }
    }
  
    async update<T>(table: string, id: number, data: Partial<T>): Promise<ApiResponse<T>> {
      try {
        const response = await fetch(`${this.PHP_API_URL}?table=${table}&operation=UPDATE&id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        return { data: result };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Error al actualizar el registro',
        };
      }
    }
  
    async delete(table: string, id: number): Promise<ApiResponse<void>> {
      try {
        const response = await fetch(`${this.PHP_API_URL}?table=${table}&operation=DELETE&id=${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        return { message: result.message };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Error al eliminar el registro',
        };
      }
    }
  }
  
  export const apiService = new ApiService();