import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"

const UserAuthorSkeleton = () => {
  return (
    <div className='flex items-start gap-8 my-8'>
      <div className='flex flex-1/4! flex-col items-center gap-4 relative'>
        <Skeleton className="w-75 aspect-square rounded-full" />
        <Skeleton className="w-1/4 h-8" />
      </div>
      <div className='flex flex-col flex-3/4'>
        <div className='flex w-full gap-2'>
          <div className='flex flex-col flex-1/2 gap-8'>
            <div className='flex gap-2 !text-2xl'>
              <Skeleton className="flex-1/2 h-12" />
              <Skeleton className="flex-1/2 h-12" />
            </div>
            <div className='flex gap-2 !text-2xl'>
              <Skeleton className="flex-1/2 h-12" />
              <Skeleton className="flex-1/2 h-12" />
            </div>
            <div className='flex gap-2 !text-2xl'>
              <Skeleton className="flex-1/2 h-12" />
              <Skeleton className="flex-1/2 h-12" />
            </div>
          </div>
          <div className='flex flex-col flex-1/2 gap-8'>
            <div className='flex gap-2 !text-2xl'>
              <Skeleton className="flex-1/2 h-12" />
              <Skeleton className="flex-1/2 h-12" />
            </div>
            <Skeleton className="flex-1/2 h-34" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAuthorSkeleton