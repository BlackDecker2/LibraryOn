import { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });

  const loginFn = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin  = () => !!user?.roles?.includes('ROLE_ADMIN');
  const isEditor = () => !!user?.roles?.includes('ROLE_EDITOR') || isAdmin();

  return (
    <AuthContext.Provider value={{ user, loginFn, logout, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
