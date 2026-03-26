"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/me")
        const data = await res.json()

        setAdmin(data.admin)
      } catch (err) {
        console.error("Failed to load admin", err)
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [])

  return (
    <AdminContext.Provider value={{ admin, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)

  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider")
  }

  return context
}