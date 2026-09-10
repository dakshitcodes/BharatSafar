import { useState, useEffect } from "react";

// Simple auth hook managing user login state in localStorage
export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("bharatverseUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("bharatverseUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("bharatverseUser");
    setUser(null);
  };

  return {
    user,
    login,
    logout,
  };
}
