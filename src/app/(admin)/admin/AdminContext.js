"use client"
import { useUser } from "@src/hooks/useUser";
import { createContext, useContext } from "react";

const AdminContext = createContext(null);

export const AdminProvider = ({ admin, children }) => {
  const { data: user } = useAdmin(admin?._id, admin);
  console.log(user)

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