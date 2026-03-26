"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useReviews(options = {}, endpoint = "/api/admin/reviews") {
  const { limit, reviewerId } = options

  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)

  const params = new URLSearchParams({
    page,
    pageSize,
    search,
    ...(limit ? { limit } : {}),
    ...(reviewerId ? { reviewerId } : {})
  })

  async function loadReviews() {
    setLoading(true)

    try {
      const res = await fetch(
        `${endpoint}?${params}`
      )

      const data = await res.json()

      setReviews(data.reviews)
      setTotalReviews(data.total)
    } catch (err) {
      console.error("Failed loading reviews", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("reviewsDeleted", (deleteIds) => {
      setReviews(prev => prev.filter(r => !deleteIds.includes(r._id)))
    })

    return () => {
      socket.off("reviewsDeleted")
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [page, pageSize, search])

  return {
    reviews,
    totalReviews,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    reload: loadReviews,
  }
}