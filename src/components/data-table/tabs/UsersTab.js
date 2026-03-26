import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptUsers } from '@src/lib/table-adapters'
import { userColumns } from '../columns/user-columns'
import { useUsers } from '@src/hooks/useUsers'

const UsersTab = ({ children }) => {
  const {
    users,
    totalUsers,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useUsers()
  const userRows = adaptUsers(users)

  return (
    <DataTable 
      data={userRows} 
      currentTab={"users"}
      columns={userColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalUsers}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default UsersTab