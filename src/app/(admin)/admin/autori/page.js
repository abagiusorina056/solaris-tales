"use client"

import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptAuthors } from '@src/lib/table-adapters'
import { authorColumns } from '@src/components/data-table/columns/author-columns'
import { useAuthors } from '@src/hooks/useAuthors'

const AdminAuthors = () => {
  const {
      authors,
      totalAuthors,
      loading: loadingAuhtors,
      page: authorsPage,
      setPage: setAuthorsPage,
      pageSize: authorsPageSize,
      setPageSize: setAuthorsPageSize,
      search: searchAuthors,
      setSearch: setSearchAuthors,
      reload: reloadAuthors,
    } = useAuthors()

  const authorRows = adaptAuthors(authors)
  return (
    <div className='pt-8 px-8'>
      <DataTable 
        data={authorRows} 
        currentTab={"authors"}
        columns={authorColumns()}
        search={searchAuthors}
        setSearch={setSearchAuthors}
        page={authorsPage}
        setPage={setAuthorsPage}
        pageSize={authorsPageSize}
        setPageSize={setAuthorsPageSize}
        loadData={reloadAuthors}
        total={totalAuthors}
        loading={loadingAuhtors}
      />
    </div>
  )
}

export default AdminAuthors