import { Separator } from '@src/components/ui/separator'
import { Skeleton } from '@src/components/ui/skeleton'
import { IconStar } from '@tabler/icons-react'
import React from 'react'

const BookSkeleton = () => {
  return (
    <div className='pt-16 w-full'>
      <div className='px-16 mb-8'>
        <div>
          <Skeleton className="w-60 h-6 mb-4 bg-gray-200" />
          <Skeleton className="w-100 h-10 bg-gray-200" />

          <div className='flex gap-18 mt-10.5'>
            <Skeleton className="w-68 h-102 bg-gray-200" />
            <div className='flex flex-1/2 flex-col'>
              <Skeleton className="w-30 h-6 mb-4 bg-gray-200" />
              <div className='flex gap-1 mb-8 items-center'>
                {
                  Array(5).fill(0).map((_, i) => (
                    <IconStar
                      key={i}
                      size={36} 
                      fill="#e5e7eb" 
                      className="text-muted animate-pulse" 
                    />
                  ))
                }
              </div>
              <Skeleton className="w-full h-40 bg-gray-200" />
              
              <div className='flex flex-col mt-12'>
                <Skeleton className="w-50 h-12 mb-2 bg-gray-200" />
                <Skeleton className="w-70 h-16 bg-gray-200" />
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className='w-full px-16'>
            <h3 className='font-extrabold text-4xl mb-7'>Recenzii:</h3>
            <div className='flex items-center w-full gap-16'>
              <Skeleton className="w-50 aspect-square bg-gray-200" />
              <div className='flex flex-col-reverse gap-2 flex-4/5'>
                {
                  Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="w-2/3 h-8 bg-gray-200" />
                  ))
                }
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className='px-16'>
            <h3 className='text-4xl font-extrabold mb-10'>Fragmente din carte:</h3>
            <Skeleton className="w-full h-100 bg-gray-200" />
          </div>

          <Separator className="my-8" />
          
          <div className='px-16'>
            <div className='flex items-baseline justify-between mb-12'>
              <Skeleton className="w-1/3 h-12 bg-gray-200" />

              <Skeleton className="w-30 h-8 bg-gray-200" />
            </div>
            <div className='flex'>
              <Skeleton className="w-80 aspect-square rounded-full mx-10 bg-gray-200" />
              <Skeleton className="w-full h-50 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookSkeleton