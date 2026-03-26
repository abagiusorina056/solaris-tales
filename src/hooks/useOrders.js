"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useOrders(options = {}, endpoint = "/api/admin/orders") {
  const { limit } = options

  const [orders, setOrders] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)

  async function loadOrders() {
    setLoading(true)

    const params = new URLSearchParams({
      page,
      pageSize,
      search,
      ...(limit ? { limit } : {}),
    })

    try {
      const res = await fetch(
        `${endpoint}?${params}`
      )
      const data = await res.json()

      setOrders(data.orders)
      setTotalOrders(data.total)
    } catch (err) {
      console.error("Failed loading orders", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("ordersDeleted", (deleteIds) => {
      setOrders(prev => prev.filter(o => !deleteIds.includes(o._id)))
    })

    return () => {
      socket.off("ordersDeleted")
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [page, pageSize, search])

  return {
    orders,
    totalOrders,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    reload: loadOrders,
  }
}