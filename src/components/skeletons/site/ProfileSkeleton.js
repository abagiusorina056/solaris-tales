import LayoutThree from '@src/app/components/book-cards/LayoutThree';
import PageTitle from '@src/app/components/PageTitle'
import { Input } from '@src/components/ui/input';
import { Separator } from '@src/components/ui/separator';
import { Skeleton } from '@src/components/ui/skeleton';
import { Table, TableHead, TableHeader, TableRow } from '@src/components/ui/table';
import React from 'react'
import { FaSearch } from 'react-icons/fa';

const ProfileSkeleton = () => {
  return (
    <div className="w-full">
      <PageTitle title="Contul meu" />

      <div className="w-full px-16 mt-4">
        <div className="flex items-start relative px-6 pt-10 gap-8 shadow-md border-2 border-solid border-[#E6E6E6]">
          <div className="flex flex-col flex-1/4 items-center">
            <Skeleton className="w-60 aspect-square rounded-full bg-gray-200" />

            <Skeleton className="w-1/3 mt-2 h-8 bg-gray-200" />
          </div>
          <div className="flex flex-col flex-2/3">
            <div className="flex gap-8">
              <Skeleton className="w-1/2 h-40 bg-gray-200" />
              <Skeleton className="w-1/2 h-40 bg-gray-200" />
            </div>
            <div className="flex items-center gap-4 !text-2xl mt-8">
              <Skeleton className="flex-1/3 h-12 bg-gray-200" />
              <Skeleton className="flex-1/3 h-12 bg-gray-200" />
              <Skeleton className="flex-1/3 h-12 bg-gray-200" />
            </div>

            <Separator />

            <Skeleton className="w-1/2 h-10 bg-gray-200 my-6 mx-auto" /> 
          </div>
        </div>

        <Separator className="my-8" />

        <div className="px-16">
          <h1 className="uppercase text-3xl font-extrabold text-[var(--color-primary)]">
            Istoric comenzi
          </h1>

          <div className='my-4'>
            <Table className="mb-4">
              <TableHeader>
                <TableRow className="text-xl font-medium">
                  <TableHead>#</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Modalitate de plata</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            {
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-8 mb-2 bg-gray-200" />
              ))
            }
          </div>
        </div>


        {
          Array(2).fill(0).map((_, i) => (
            <>
              <Separator className="my-8" />

              <div className="px-16" id="favorite">
                <div className="flex items-end justify-between">
                  <h1 className="uppercase text-3xl font-extrabold text-[var(--color-primary)]">
                    <span>{i === 0 ? "Favoritele" : "Cartile"} mele</span>
                  </h1>
                  <div className="flex items-center bg-white px-3 rounded-l-sm text-xl">
                    <FaSearch size={24} className="text-[var(--color-primary)]" />
                    <Input
                      placeholder="Cauta..."
                      type="text"
                      name="search"
                      id="search"
                      disabled
                      className="w-full shadow-none !text-xl border-0 ring-0 outline-0 bg-transparent placeholder:text-[var(--color-primary)] placeholder:select-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-16">
                  {
                    Array(2).fill(0).map((_, i) => (
                      <div key={i} className='flex items-center rounded-xl px-6 py-8 shadow-xl'>
                        <Skeleton className="w-1/4 aspect-[1/1.5]! mr-2 bg-gray-200" />

                        <div className='px-4 w-2/3 flex flex-col gap-2'>
                          <Skeleton className="w-1/2 h-8 bg-gray-200" />
                          <Skeleton className="w-1/3 h-8 bg-gray-200" />

                          <Skeleton className="w-full h-20 bg-gray-200" />

                          <div className='flex items-baseline justify-between mt-3'>
                            <Skeleton className="w-1/4 h-8 bg-gray-200" />
                            <Skeleton className="w-1/4 h-10 bg-gray-200" />
                          </div>
                        </div>
                    </div>
                    ))
                  }
                </div>
              </div>
            </>
          ))
        }
      </div>
    </div>
  )
}

export default ProfileSkeleton