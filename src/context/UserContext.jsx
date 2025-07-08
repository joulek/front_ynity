import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      method: "GET",               // ✅ Obligatoire
      credentials: "include",      // ✅ Pour envoyer les cookies
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);


  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}
