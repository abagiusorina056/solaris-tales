import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"
import { Input } from '@src/components/ui/input'
import { Button } from '@src/components/ui/button'
import { IconX } from '@tabler/icons-react'

const ManuscriptsSkeleton = () => {
  return (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        <div className="flex items-center mb-8">
          <Input
            placeholder="Caută..."
            disabled
            className="w-64"
          />
          <Button 
            variant="ghost"
            disabled
            className={"cursor-pointer"}
          >
            <IconX size={32} />
          </Button>
        </div>

        <div className='grid grid-cols-3 gap-32'>
          {
            Array(3).fill(0).map((_, i ) => (
              <div key={i} className='flex flex-col gap-2 col-span-1 pt-4 pb-8 px-6 bg-gray-200 rounded-md'>
                <Skeleton className="w-1/2 h-6" />
                <Skeleton className="w-full aspect-[1/1.5]" />
                <div>
                  <Skeleton className="w-1/2 h-6 mb-2" />
                  <div className='flex items-center gap-2'>
                    <Skeleton className="w-1/3 h-6" />
                    <span className='text-gray-100'>•</span>
                    <Skeleton className="w-1/3 h-6" />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ManuscriptsSkeleton