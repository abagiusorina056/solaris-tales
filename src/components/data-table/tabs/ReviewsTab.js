import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptReviews } from '@src/lib/table-adapters'
import { useReviews } from '@src/hooks/useReviews'
import { reviewColumns } from '../columns/reviews-columns'

const ReviewsTab = ({ 
  options = {}, 
  endpoint, 
  children,
  isReviewerActive = true,
  isBookActive = true
}) => {
  const {
    reviews,
    totalReviews,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    loading,
    reload
  } = useReviews(options, endpoint)
  const reviewsRows = adaptReviews(
    reviews, 
    isReviewerActive,
    isBookActive
  )

  return (
    <DataTable 
      data={reviewsRows} 
      currentTab={"reviews"}
      columns={reviewColumns()}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      loadData={reload}
      total={totalReviews}
      loading={loading}
    >
      {children}
    </DataTable>
  )
}

export default ReviewsTab