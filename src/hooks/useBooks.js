"use client"

import { socket } from "@src/lib/socketClient"
import { useEffect, useState } from "react"

export function useBooks(
  options = {}, 
  endpoint = "/api/admin/books", 
  searchTerm = ""
) {
  const { limit } = options

  const [sort, setSort] = useState({
    field: "",
    order: 1
  })
  const [filters, setFilters] = useState({
    genre: "",
    minPrice: 0,
    maxPrice: 9999,
    discount: "false"
  });
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(searchTerm)

  const [loading, setLoading] = useState(false)

  async function loadBooks() {
    setLoading(true)

    const params = new URLSearchParams({
      page,
      pageSize,
      search,
      sortField: sort.field,
      sortOrder: sort.order,
      genre: filters.genre,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      discount: filters.discount,
      ...(limit ? { limit } : {}),
    })

    try {
      const res = await fetch(
        `${endpoint}?${params}`
      )
      const data = await res.json()

      setBooks(data.books)
      setTotalBooks(data.total)
    } catch (err) {
      console.error("Failed loading books", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    socket.on("booksDeleted", (deleteIds) => {
      setBooks(prev => prev.filter(b => !deleteIds.includes(b._id)))
    })

    return () => {
      socket.off("booksDeleted")
    }
  }, [])

  useEffect(() => {
    loadBooks()
  }, [page, pageSize, search, sort, filters])

  return {
    books,
    totalBooks,
    loading,

    page,
    setPage,

    pageSize,
    setPageSize,

    search,
    setSearch,

    sort,
    setSort,

    filters,
    setFilters,

    reload: loadBooks,
  }
}