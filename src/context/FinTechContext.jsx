import { createContext, useState } from "react";

export const FinTechContext = createContext();

export function FinTechProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <FinTechContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </FinTechContext.Provider>
  );
}