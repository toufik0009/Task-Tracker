import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const login = (jwt, userData) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userCountry", userData.country);

    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userCountry");
    localStorage.removeItem("Projects");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
