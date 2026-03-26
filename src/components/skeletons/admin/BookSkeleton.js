import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"

const BookSkeleton = () => {
  return (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        <Skeleton className="w-60 h-6 mb-4" />
        <Skeleton className="w-100 h-10" />

        <div className='flex gap-18 mt-10.5'>
          <Skeleton className="w-68 h-102" />
          <div className='flex flex-1/2 flex-col'>
            <Skeleton className="w-75 h-6 mb-4" />
            <Skeleton className="w-full h-40" />
            
            <div className='flex flex-col mt-12'>
              <Skeleton className="w-50 h-12 mb-2" />
              <Skeleton className="w-70 h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookSkeleton