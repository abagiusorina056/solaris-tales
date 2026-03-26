import { DataTable } from '@src/components/data-table'
import React from 'react'
import { authorColumns } from '../columns/author-columns'
import { useAuthors } from '@src/hooks/useAuthors'
import { adaptAuthors } from '@src/lib/table-adapters'
import DataTableSkeleton from '@src/components/skeletons/admin/DataTableSkeleton'

const AuthorsTab = ({ children }) => {
  const {
    authors,
    totalAuthors,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useAuthors()
  const authorRows = adaptAuthors(authors)

  

  return (
    <DataTable 
      data={authorRows} 
      currentTab={"authors"}
      columns={authorColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalAuthors}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default AuthorsTab