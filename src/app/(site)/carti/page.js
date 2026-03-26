"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import LayoutTwo from "@src/app/components/book-cards/LayoutTwo";
import { MdOutlineSearchOff } from "react-icons/md";
import { FaFilter, FaSearch, FaSortAmountDown } from "react-icons/fa";
import { Input } from "@src/components/ui/input";
import PageTitle from "@src/app/components/PageTitle";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@src/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Label } from "@src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useUser } from "@src/hooks/useUser";
import { useBooks } from "@src/hooks/useBooks";
import { IconLoader2, IconStar } from "@tabler/icons-react";
import BooksSkeleton from "@src/components/skeletons/site/BooksSkeleton";

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 3;

const BooksView = () => {
  const { user } = useUser()
  const { 
    books: books,
    page,
    setPage,
    totalBooks,
    search,
    setSearch,
    pageSize,
    loading,
    reload
  } = useBooks({},  "/api/books")
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

  return books.length === 0 && search.length === 0 ? (
    <BooksSkeleton />
  ) : (
    <div className="w-full flex flex-col items-center" ref={ref}>
      <PageTitle title="Carti" />

      <div className="w-full flex items-center justify-end mt-8 px-8" >
        <span className='opacity-50 ml-auto mr-2'>{totalBooks} rezultate</span>
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
        <Dialog>
          <DialogTrigger className="flex items-center px-4 py-1 text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl border-r-2 border-[var(--color-primary)] cursor-pointer">
            <FaFilter size={20} className="mr-2" />
            <span>Filtreaza</span>
          </DialogTrigger>
          <DialogContent className="bg-[#f7f7f7]">
            <DialogHeader>
              <DialogTitle>Esti sigur ca vrei sa renunti?</DialogTitle>
              <DialogDescription>
                <Button
                  // onClick={handleCancelling}
                  className="cursor-pointer bg-[var(--color-primary)] border-1"
                >
                  Confirma
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="flex items-center px-4 py-1 text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl cursor-pointer rounded-r-sm">
            <FaSortAmountDown size={20} className="mr-2" />
            <span>Sorteaza</span>
          </DialogTrigger>
          <DialogContent className="bg-[#f7f7f7]">
            <DialogHeader>
              <DialogTitle className="flex items-baseline font-normal text-4xl text-[var(--color-primary)]">
                <FaSortAmountDown size={24} className="mr-2" />
                <span>Sorteaza</span>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <div className="flex items-baseline gap-2">
                <div className="flex-1/2">
                  <Label className="not-required font-semibold text-xl">
                    Data publicarii
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="newest">Cele mai noi</SelectItem>
                        <SelectItem value="oldest">Cele mai vechi</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1/2">
                  <Label className="not-required font-semibold text-xl">
                    Pret
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="newest">Pret crescator</SelectItem>
                        <SelectItem value="oldest">Pret descrescator</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <div className="flex-1/2">
                  <Label className="not-required font-semibold text-xl">
                    Titlu
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="alphabetical">Alfabetic (A-Z)</SelectItem>
                        <SelectItem value="rAlphabetical">Alfabetic invers (Z-A)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1/2">
                  <Label className="not-required font-semibold text-xl">
                    Rating
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="bookRating">Rating carte</SelectItem>
                        <SelectItem value="authorRating">Rating autor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="w-full flex gap-2 mt-12">
              <Button
              // onClick={handleCancelling}
                className="flex-1/2 text-xl cursor-pointer text-[var(--color-primary)] bg-[#d9d9d9] hover:bg-[#d9d9d9] border-1" 
              >
                Reseteaza
              </Button>
              <Button
                // onClick={handleCancelling} 
                className="flex-1/2 text-xl cursor-pointer bg-[var(--color-primary)] border-1"
              >
                {" "}
                Aplica filtrele
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {books.length ? (
        <div className="w-full grid grid-cols-4 gap-16 px-12 mt-10">
          {books.map((book) => (
            <LayoutTwo
              key={book._id}
              book={book}
              userId={user._id}
              favorite={user?.favorites?.includes(book._id)}
              reviews={book.reviews}
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
  );
};

export default BooksView;