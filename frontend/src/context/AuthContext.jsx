import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    return savedAuth === "true";
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });
  const navigate = useNavigate();

  const login = (id) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("userId", id);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUserId(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
