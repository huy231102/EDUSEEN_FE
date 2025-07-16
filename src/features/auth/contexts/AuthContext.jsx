import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from 'hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('authToken', null);
  const [user, setUser] = useLocalStorage('authUser', null);

  /**
   * Lưu token (và tuỳ ý dữ liệu người dùng) sau khi đăng nhập thành công
   * @param {string} authToken JWT token trả về từ BE
   * @param {object|null} userData Thông tin người dùng (nếu đã có)
   */
  const login = (authToken, userData = null) => {
    if (authToken) {
      setToken(authToken);
    }
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 