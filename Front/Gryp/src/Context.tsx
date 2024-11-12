import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string,
  userName: string,
  rut: string,
  email: string,
  phone: string,
  region: string
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto de usuario
export const useUser = () => useContext(UserContext);


