"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useUsers(options = {}, endpoint = "/api/admin/users") {
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)

  async function loadUsers() {
    setLoading(true)

    const params = new URLSearchParams({
      page,
      pageSize,
      search,
    })

    try {
      const res = await fetch(
        `${endpoint}?${params}`
      )

      const data = await res.json()

      setUsers(data.users)
      setTotalUsers(data.total)
    } catch (err) {
      console.error("Failed loading users", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("usersDeleted", (deleteIds) => {
      setUsers(prev => prev.filter(u => !deleteIds.includes(u._id)))
    })

    return () => {
      socket.off("usersDeleted")
    }
  }, [])
  
  useEffect(() => {
    loadUsers()
  }, [page, pageSize, search])

  return {
    users,
    totalUsers,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    reload: loadUsers,
  }
}