import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"

const OrderSkeleton = () => {
  return (
    <div className='w-full pt-16'>
      <div className='w-full px-16'>
        <Skeleton className="w-1/3 h-[50px] rounded-full mb-4" />
        <div className='grid grid-cols-4 gap-16'>
          {[1, 2, 3].map((s) => (
            <div key={s} className='col-span-1 mb-2'>
              <Skeleton className="w-full aspect-[1/1.5]  mb-2" />
              <Skeleton className="w-2/3 h-[20px] mb-2" />
              <Skeleton className="w-1/3 h-[20px]" />
            </div>
          ))}
        </div>
        <Skeleton className="w-full h-[300px] mt-8" />
      </div>
    </div>
  )
}

export default OrderSkeleton