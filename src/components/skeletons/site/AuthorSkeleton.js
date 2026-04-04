import { Separator } from '@src/components/ui/separator'
import { Skeleton } from '@src/components/ui/skeleton'
import React from 'react'
import BooksSkeleton from './BooksSkeleton'

const AuthorSkeleton = () => {
  return (
      <div className='pt-16 w-full'>
        <div className='px-16'>
          <div className='flex items-start gap-8 w-full'>
            <Skeleton className="w-75 aspect-square bg-gray-200 rounded-full" />
            <div className='w-full'>
              <Skeleton className="w-100 h-12 bg-gray-200 mb-4" />

              <Skeleton className="w-full h-40 bg-gray-200 mb-4" />
              <Skeleton className="w-50 h-8 bg-gray-200" />
            </div>
          </div>

          <Separator className={"my-8"} />

          <BooksSkeleton numOfBooks={4} showTitle={false}>
            <h1 className='text-4xl font-semibold mr-auto'>Carti:</h1>
          </BooksSkeleton>
        </div>
      </div>
  )
}

export default AuthorSkeleton