import React, { createContext, useState, useContext } from 'react';
// Create a Context with default value (can be null or an object)
const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  // You can store just the username or an entire user object
  const [username, setUsername] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for ease of use in other components
export const useUser = () => useContext(UserContext);

/*
This file is used to that any other file/screen can reference the username 
*/