import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"
import PageTitle from '@src/app/components/PageTitle'
import { Input } from '@src/components/ui/input'
import { IconLoader2, IconStar } from '@tabler/icons-react'
import { FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa'

const AuthorsSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <PageTitle title="Carti" />

      <div className="w-full flex items-center justify-end mt-8 px-8" >
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
      <div className="w-full grid grid-cols-4 grid-rows-2 gap-10 px-12 py-6">
        {
          Array(8).fill(0).map((_, i) => (
            <div 
              key={i}
              className="flex flex-col rounded-4xl w-fit mx-auto px-8 py-2 col-span-1 items-center shadow-md"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <IconStar
                  key={i}
                  size={36} 
                  fill="#e5e7eb" 
                  className="text-muted animate-pulse" 
                />
                <Skeleton className="w-8 aspect-square bg-gray-200" />
              </div>
              <Skeleton className="w-60 aspect-square rounded-full bg-gray-200" />
              <Skeleton className="w-2/3 h-6 mt-4 bg-gray-200" />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AuthorsSkeleton