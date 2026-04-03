"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useAuthors(options = {}, endpoint = "/api/admin/authors") {
  const { limit } = options

  const [sort, setSort] = useState({
    field: "",
    order: 1
  })
  const [authors, setAuthors] = useState([])
  const [totalAuthors, setTotalAuthors] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(limit || 10)
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)

  async function loadAuthors() {
    setLoading(true)

    const params = new URLSearchParams({
      page,
      pageSize,
      search,
      sortField: sort.field,
      sortOrder: sort.order,
      ...(limit ? { limit } : {})
    })

    try {
      const res = await fetch(
        `${endpoint}?${params}`
      )
      const data = await res.json()

      setAuthors(data.authors)
      setTotalAuthors(data.total)
    } catch (err) {
      console.error("Failed loading authors", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("authorsDeleted", (deleteIds) => {
      setAuthors(prev => prev.filter(a => !deleteIds.includes(a._id)))
    })

    return () => {
      socket.off("authorsDeleted")
    }
  }, [])

  useEffect(() => {
    loadAuthors()
  }, [page, pageSize, search, sort])

  return {
    authors,
    totalAuthors,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    sort,
    setSort,

    reload: loadAuthors,
  }
}