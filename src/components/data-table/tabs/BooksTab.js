import { DataTable } from '@src/components/data-table'
import { useBooks } from '@src/hooks/useBooks'
import React from 'react'
import { bookColumns } from '../columns/book-columns'
import { adaptBooks } from '@src/lib/table-adapters'

const BooksTab = ({ endpoint, children, isAuthorActive = true }) => {
  const {
    books,
    totalBooks,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useBooks({}, endpoint)
  const booksRows = adaptBooks(books, isAuthorActive)

  return (
    <DataTable 
      data={booksRows} 
      currentTab={"books"}
      columns={bookColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalBooks}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default BooksTab