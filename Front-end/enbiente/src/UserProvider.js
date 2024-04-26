import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [fotoUsuario, setFotoUsuario] = useState('');
  const [updateComponent, setUpdateComponent] = useState(false); // Variável para atualizar o componente

  const updateUserComponent = () => {
    setUpdateComponent(prevState => !prevState);
  };

  return (
    <UserContext.Provider value={{ fotoUsuario, setFotoUsuario, updateComponent, updateUserComponent }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);