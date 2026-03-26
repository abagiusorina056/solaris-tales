"use client"

import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptPublishRequests } from '@src/lib/table-adapters'
import { requestColumns } from '@src/components/data-table/columns/requests-columns'
import { useRequests } from '@src/hooks/useRequests'

const AdminBooks = () => {
  const {
    requests,
    totalRequests,
    loading: loadingRequests,
    page: requestsPage,
    setPage: setRequestsPage,
    pageSize: requestsPageSize,
    setPageSize: setRequestsPageSize,
    search: searchRequests,
    setSearch: setSearchRequests,
    reload: reloadRequests,
  } = useRequests()
  const requestsRows = adaptPublishRequests(requests)
  return (
    <div className='pt-8 px-8'>
      <DataTable 
        data={requestsRows} 
        currentTab={"requests"}
        columns={requestColumns()}
        search={searchRequests}
        setSearch={setSearchRequests}
        page={requestsPage}
        setPage={setRequestsPage}
        pageSize={requestsPageSize}
        setPageSize={setRequestsPageSize}
        loadData={reloadRequests}
        total={totalRequests}
        loading={loadingRequests}
      />
    </div>
  )
}

export default AdminBooks