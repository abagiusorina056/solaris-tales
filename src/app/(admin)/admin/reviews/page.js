"use client"

import { DataTable } from '@src/components/data-table'
import React from 'react'
import { adaptReviews } from '@src/lib/table-adapters'
import { reviewColumns } from '@src/components/data-table/columns/reviews-columns'
import { useReviews } from '@src/hooks/useReviews'

const AdminReviews = () => {
  const {
      reviews,
      totalReviews,
      loading: loadingReviews,
      page: reviewsPage,
      setPage: setReviewsPage,
      pageSize: reviewsPageSize,
      setPageSize: setReviewsPageSize,
      search: searchReviews,
      setSearch: setSearchReviews,
      reload: reloadReviews,
    } = useReviews()
    const reviewsRows = adaptReviews(reviews)
  return (
    <div className='pt-8 px-8'>
      <DataTable 
        data={reviewsRows} 
        currentTab={"reviews"}
        columns={reviewColumns()}
        search={searchReviews}
        setSearch={setSearchReviews}
        page={reviewsPage}
        setPage={setReviewsPage}
        pageSize={reviewsPageSize}
        setPageSize={setReviewsPageSize}
        loadData={reloadReviews}
        total={totalReviews}
        loading={loadingReviews}
      />
    </div>
  )
}

export default AdminReviews