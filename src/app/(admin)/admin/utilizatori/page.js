"use client"

import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptUsers } from '@src/lib/table-adapters'
import { userColumns } from '@src/components/data-table/columns/user-columns'
import { useUsers } from '@src/hooks/useUsers'

const AdminUsers = () => {
  const {
    users,
    totalUsers,
    loading: loadingUsers,
    page: usersPage,
    setPage: setUsersPage,
    pageSize: usersPageSize,
    setPageSize: setUsersPageSize,
    search: searchUsers,
    setSearch: setSearchUsers,
    reload: reloadUsers,
  } = useUsers()
  const userRows = adaptUsers(users.filter(u => u.role !== "admin"))

  return (
    <div className='pt-8 px-8'>
      <DataTable 
        data={userRows} 
        currentTab={"users"}
        columns={userColumns()}
        search={searchUsers}
        setSearch={setSearchUsers}
        page={usersPage}
        setPage={setUsersPage}
        pageSize={usersPageSize}
        setPageSize={setUsersPageSize}
        loadData={reloadUsers}
        total={totalUsers}
        loading={loadingUsers}
      />
    </div>
  )
}

export default AdminUsers