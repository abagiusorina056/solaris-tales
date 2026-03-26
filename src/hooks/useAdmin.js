"use client"

import { useEffect, useState } from "react"

export function useAdmin() {
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

  return { admin, loading }
}