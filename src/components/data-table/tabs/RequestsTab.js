import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptPublishRequests } from '@src/lib/table-adapters'
import { useRequests } from '@src/hooks/useRequests'
import { requestColumns } from '../columns/requests-columns'

const RequestsTab = ({ children }) => {
  const {
    requests,
    totalRequests,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useRequests()
  const requestRows = adaptPublishRequests(requests)

  return (
    <DataTable 
      data={requestRows} 
      currentTab={"requests"}
      columns={requestColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalRequests}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default RequestsTab