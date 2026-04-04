import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"
import PageTitle from '@src/app/components/PageTitle'
import { Input } from '@src/components/ui/input'
import { IconLoader2, IconStar } from '@tabler/icons-react'
import { 
  FaFilter, 
  FaSearch, 
  FaSortAmountDown 
} from 'react-icons/fa'

const BooksSkeleton = ({ numOfBooks = 8, children, showTitle = true }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {showTitle && <PageTitle title="Carti" />}

      <div className="w-full flex items-center justify-end mt-8 px-8" >
        {children}
        <IconLoader2 className='rotate mr-2' />
        <div className="flex items-center bg-white px-3 rounded-l-sm text-xl">
          <FaSearch
            size={24}
            className="text-[var(--color-primary)]"
            cursor="pointer"
          />
          <Input
            placeholder="Cauta..."
            type="text"
            name="search"
            id="search"
            disabled
            className="w-full shadow-none !text-xl border-0 ring-0 outline-0 bg-transparent placeholder:text-[var(--color-primary)] placeholder:select-none"
          />	
        </div>
        <div className="flex items-center px-4 py-1 text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl border-r-2 border-[var(--color-primary)] cursor-pointer">
          <FaFilter size={20} className="mr-2" />
          <span>Filtreaza</span>
        </div>
        <div className="flex items-center px-4 py-1 text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl cursor-pointer rounded-r-sm">
          <FaSortAmountDown size={20} className="mr-2" />
          <span>Sorteaza</span>
        </div>
      </div>
      <div className="w-full grid grid-cols-4 gap-16 px-12 mt-10">
        {
          Array(numOfBooks).fill(0).map((_, i) => (
            <div key={i} className='flex flex-col items-center relative justify-between text-black uppercase font-extrabold mt-10 shadow-md'>
              <Skeleton className="w-2/3! aspect-[1/1.5] bg-gray-200" />

              <Skeleton className="mt-6 w-3/4 h-6 bg-gray-200!" />
              <Skeleton className="mt-2 w-1/2 h-4 bg-gray-200!" />

              <div className='flex items-center mt-3 gap-1'>
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
              <div className='flex items-baseline-last justify-between w-full px-10 mt-3 mb-2'>
                  <Skeleton className="w-2/3 h-8 bg-gray-200" />
                  
                  <Skeleton className="h-10 aspect-square bg-gray-200" />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default BooksSkeleton