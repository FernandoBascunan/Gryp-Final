export const getData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test');
      if (!response.ok) {
        throw new Error('Error al obtener datos');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  