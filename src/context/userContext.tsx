'use client'

import { User } from '@/lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user')
    console.log("Data", userData)
    console.log(user)
    setUser(JSON.parse(userData || '{}'))
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
