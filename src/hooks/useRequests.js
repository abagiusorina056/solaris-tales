"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useRequests() {
  const [requests, setRequests] = useState([])
  const [totalRequests, setTotalRequests] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)

  async function loadRequests() {
    setLoading(true)

    try {
      const res = await fetch(
        `/api/admin/requests?page=${page}&pageSize=${pageSize}&search=${search}`
      )

      const data = await res.json()

      setRequests(data.requests)
      setTotalRequests(data.total)
    } catch (err) {
      console.error("Failed loading requests", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("requestUpdated", ({ requestId, newStatus }) => {
      setRequests(prev => prev.map(r => {
        if (r._id === requestId) {
          r.status = newStatus
        }

        return r
      }))
    })

    return () => {
      socket.off("requestUpdated")
    }
  }, [])

  useEffect(() => {
    loadRequests()
  }, [page, pageSize, search])

  return {
    requests,
    totalRequests,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    reload: loadRequests,
  }
}