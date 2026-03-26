"use client"

import { Separator } from '@src/components/ui/separator'
import { useAuthors } from '@src/hooks/useAuthors'
import { IconAlertTriangle } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useMemo, useRef } from 'react'
import defaultProfilePic from "@public/default-profile-pic.png"
import { FaSearch, FaSortAmountDown, FaStar } from 'react-icons/fa'
import { Input } from '@src/components/ui/input'
import { Button } from '@src/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@src/components/ui/pagination";
import LayoutTwo from '@src/app/components/book-cards/LayoutTwo'
import { MdOutlineSearchOff } from 'react-icons/md'
import { useUser } from '@src/hooks/useUser'
import AuthorSkeleton from '@src/components/skeletons/site/AuthorSkeleton'

const ITEMS_PER_PAGE = 6

const AuthorView = ({ id }) => {
  const { 
    authors: author,
    page,
    setPage,
    totalAuthors: totalBooks,
    search,
    setSearch,
    loading,
    reload
  } = useAuthors({}, `/api/authors/${id}`)
  const { user } = useUser()

  const ref = useRef(null)
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);
  
  const paginationItems = useMemo(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth"})
    }

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= PAGE_WINDOW) {
      return [1, 2, 3, "ellipsis", totalPages];
    }

    if (page >= totalPages - (PAGE_WINDOW - 1)) {
      return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
  }, [page, totalPages]);


  return !author._id ? (
    <AuthorSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16'>
        <AuthorCard author={author} />

        <Separator className={"my-8"} />

        <div className="w-full flex items-center justify-end mt-8 px-8">
          <h1 className='text-4xl font-semibold mr-auto'>Carti:</h1>
          <span className="mr-4 opacity-50">{totalBooks} rezultate</span>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              className="w-full shadow-none !text-xl border-0 ring-0 outline-0 bg-transparent placeholder:text-[var(--color-primary)] placeholder:select-none"
            />
          </div>
          <Button
            variant="default"
            className="text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl cursor-pointer rounded-r-sm"
            type="button"
          >
            <FaSortAmountDown size={24} className="mr-2" />
            <span>Sorteaza</span>
          </Button>
        </div>

        {author?.books && author?.books.length ? (
          <div className="w-full grid grid-cols-4 gap-16 px-12 mt-10">
            {author.books.map((book) => (
              <LayoutTwo
                key={book._id}
                book={book}
                userId={user._id}
                favorite={user?.favorites?.includes(book._id)}
                reviews={author?.reviews.filter(r => r.bookId === book._id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-[var(--color-primary)]/60">
            <MdOutlineSearchOff size={160} />
            <p className="text-4xl">Nu s-au gasit rezultate</p>
          </div>
        )}

        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-[var(--color-primary)]! text-xl cursor-default"
              />
            </PaginationItem>
  
            {paginationItems.map((item, i) =>
              item === "ellipsis" ? (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={i} className="cursor-default">
                  <PaginationLink
                    isActive={page === item}
                    onClick={() => setPage(item)}
                    className={
                      page === item &&
                      "bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white!"
                    }
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
  
            <PaginationItem>
              <PaginationNext
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-[var(--color-primary)]! text-xl cursor-default"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

const AuthorCard = ({ author }) => {
 return (
  <div className='flex items-start gap-8 w-full'>
    <Image
      src={author?.image || defaultProfilePic}
      width={300}
      height={300}
      alt={author.name}
      className="rounded-full"
    />
    <div className='w-full'>
      <div className='flex w-full items-baseline justify-between'>
        <h1 className='text-5xl text-[var(--color-primary)]'>{author.name}</h1>
        <IconAlertTriangle 
          size={36} 
          className='opacity-50'
          cursor={"pointer"} 
          title='Raporteaza'
        />
      </div>
      <p className='text-2xl mt-8'>{author.bio}</p>
      <div className='flex items-center text-2xl font-semibold mt-4'>
        <span>Rating:</span>
        <span className='ml-2'>{author.rating}</span>
        <FaStar size={28} className='text-yellow-400' />
      </div>
    </div>
  </div>
 )
}

export default AuthorView