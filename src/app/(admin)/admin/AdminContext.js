"use client"
import { createContext, useContext } from "react";

const AdminContext = createContext(null);

export const AdminProvider = ({ admin, children }) => {
  return (
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};