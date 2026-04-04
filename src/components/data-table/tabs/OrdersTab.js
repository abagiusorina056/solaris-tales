import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptOrders } from '@src/lib/table-adapters'
import { useOrders } from '@src/hooks/useOrders'
import { ordersColumns } from '../columns/order-columns'

const OrdersTab = ({ endpoint, children }) => {
  const {
    orders,
    totalOrders,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useOrders({}, endpoint)
  const orderRows = adaptOrders(orders)

  return (
    <DataTable 
      data={orderRows} 
      currentTab={"orders"}
      columns={ordersColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalOrders}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default OrdersTab