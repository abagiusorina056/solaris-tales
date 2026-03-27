import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"
import { cn } from '@src/lib/utils'

const OrderSkeleton = ({ isDashboard = true}) => {
  return (
    <div className='w-full pt-16'>
      <div className='w-full px-16'>
        <Skeleton className={cn("w-1/3 h-[50px] rounded-full mb-4", !isDashboard && "bg-gray-200")} />
        <div className='grid grid-cols-4 gap-16'>
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn('col-span-1 mb-2', !isDashboard && "bg-gray-200")}>
              <Skeleton className={cn("w-full aspect-[1/1.5]  mb-2", !isDashboard && "bg-gray-200")} />
              <Skeleton className={cn("w-2/3 h-[20px] mb-2", !isDashboard && "bg-gray-200")} />
              <Skeleton className={cn("w-1/3 h-[20px]", !isDashboard && "bg-gray-200")} />
            </div>
          ))}
        </div>
        <Skeleton className={cn("w-full h-[300px] mt-8", !isDashboard && "bg-gray-200")} />
      </div>
    </div>
  )
}

export default OrderSkeleton