"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import LayoutTwo from "@src/app/components/book-cards/LayoutTwo";
import { MdOutlineSearchOff } from "react-icons/md";
import { FaFilter, FaSearch, FaSortAmountDown } from "react-icons/fa";
import { Input } from "@src/components/ui/input";
import PageTitle from "@src/app/components/PageTitle";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@src/components/ui/command"
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Label } from "@src/components/ui/label";
import { Slider } from "@src/components/ui/slider"
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
import { IconCalendarDown, IconCalendarUp, IconCashBanknoteMove, IconCashBanknoteMoveBack, IconCheck, IconLoader2, IconSortAZ, IconSortZA, IconStar, IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";
import BooksSkeleton from "@src/components/skeletons/site/BooksSkeleton";
import { useSearchParams } from "next/navigation";
import { Separator } from "@src/components/ui/separator";
import { genres } from "@src/lib/genres";

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 3;
const sortingOptions = [
  {
    id: 1,
    label: "Cele mai noi",
    icon: IconCalendarUp,
    order: -1,
    field: "createdAt",
  },
  {
    id: 2,
    label: "Cele mai vechi",
    icon: IconCalendarDown,
    order: 1,
    field: "createdAt",
  },
  {
    id: 3,
    label: "Pret crescator",
    icon: IconCashBanknoteMove,
    order: 1,
    field: "price",
  },
  {
    id: 4,
    label: "Pret descrescator",
    icon: IconCashBanknoteMoveBack,
    order: -1,
    field: "price",
  },
  {
    id: 5,
    label: "Alfabetic",
    icon: IconSortAZ,
    order: 1,
    field: "title",
  },
  {
    id: 6,
    label: "Alfabetic invers",
    icon: IconSortZA,
    order: -1,
    field: "title",
  },
  {
    id: 7,
    label: "Rating crescator",
    icon: IconStarHalfFilled,
    order: 1,
    field: "rating",
  },
  {
    id: 8,
    label: "Rating descrescator",
    icon: IconStarFilled,
    order: -1,
    field: "rating",
  },
]

const BooksView = () => {
  const { data: user, invalidateUser } = useUser()
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("term");
  const { 
    books: books,
    page,
    setPage,
    totalBooks,
    search,
    setSearch,
    setSort,
    setFilters,
    pageSize,
    loading,
    reload
  } = useBooks({},  "/api/books", searchTerm || "")
  const ref = useRef(null)
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE)
  const [currentSorting, setCurrentSorting] = useState({})
  const [isSorting, setIsSorting] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [sortDialog, setSortDialog] = useState(false)
  const [filterDialog, setFilterDialog] = useState(false)
  const [genreDialog, setGenreDialog] = useState(false)
  const prices = books.map(book => parseFloat(book?.price));
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [currentFiltering, setCurrentFiltering] = useState({
    minPrice,
    maxPrice,
    genre: "",
    isDiscount: "false"
  })

  const handleSortChange = () => {
    setIsSorting(true)
    if (currentSorting && currentSorting.field) {
      setSort({ 
        field: currentSorting.field, 
        order: currentSorting.order 
      })
    }

    setTimeout(() => {
      setSortDialog(false)
      setIsSorting(false)
    }, 500)
  };

  const handleFilterChange = () => {
    setIsFiltering(true)

    if (currentFiltering) {
      setFilters({ 
        genre: currentFiltering.genre,
        minPrice: currentFiltering.minPrice,
        maxPrice: currentFiltering.maxPrice,
        discount: currentFiltering.isDiscount
      })
    }

    setTimeout(() => {
      setFilterDialog(false)
      setIsFiltering(false)
    }, 500)
  }
  
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

  useEffect(() => {
    const prices = books.map(book => parseFloat(book?.price));

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setCurrentFiltering(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }))
  }, [books])

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
        <Dialog open={filterDialog} onOpenChange={setFilterDialog}>
          <DialogTrigger className="flex items-center px-4 py-1 text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl border-r-2 border-[var(--color-primary)] cursor-pointer">
            <FaFilter size={20} className="mr-2" />
            <span>Filtreaza</span>
          </DialogTrigger>
          <DialogContent className="bg-[#f7f7f7]">
            <DialogHeader>
              <DialogTitle className="flex items-baseline font-normal text-4xl text-[var(--color-primary)]">
                <FaFilter size={24} className="mr-2" />
                <span>Filtreaza</span>
              </DialogTitle>
              <DialogDescription>
                <div className="grid w-full gap-3 mt-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label 
                      htmlFor="price-slider" 
                      className="not-required text-xl"
                    >
                      Pret
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {
                        [
                          currentFiltering.minPrice,
                          currentFiltering.maxPrice
                        ].join(" - ")
                      } RON
                    </span>
                  </div>
                  <Slider
                    id="price-slider"
                    value={[
                      currentFiltering.minPrice,
                      currentFiltering.maxPrice
                    ]}
                    onValueChange={(value) => setCurrentFiltering(prev => ({
                      ...prev,
                      minPrice: value[0],
                      maxPrice: value[1],
                    }))}
                    min={minPrice}
                    max={maxPrice}
                    step={10}
                  />
                </div>
                <div className="my-4">
                  <Label
                    htmlFor="price"
                    className="font-semibold text-xl not-required"
                  >
                    Gen
                  </Label>
                  <Input
                    variant="default"
                    type="text"
                    id="genre"
                    name="genre"
                    onClick={() => setGenreDialog(true)}
                    value={genres.genres.find(g => g.slug === currentFiltering?.genre).label || ""}
                    onChange={() => {}}
                    className="bg-white py-6 !text-xl"
                  />
                </div>
                <CommandDialog open={genreDialog} onOpenChange={setGenreDialog}>
                  <Command>
                    <CommandInput placeholder="Cauta un gen literar..." />
                    <CommandList>
                      <CommandEmpty>Niciun gen gasit</CommandEmpty>
                      <CommandGroup >
                        {genres.genres.map((g, i) => (
                          <CommandItem 
                            key={g.id}
                            className={"px-0! py-0!"}
                            >
                            <span 
                              className='w-full px-2 py-1.5'
                              onClick={() => {
                                setCurrentFiltering(prev => ({
                                  ...prev,
                                  genre: g?.slug
                                }))
                                setGenreDialog(false)
                              }}
                            >{g.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </CommandDialog>
                <div className="my-4">
                  <Label
                    htmlFor="discount"
                    className="font-semibold text-xl not-required"
                  >
                    Discount
                  </Label>
                  <Select
                    value={currentFiltering.isDiscount}
                    onValueChange={(value) => setCurrentFiltering(prev => ({
                      ...prev,
                      isDiscount: value
                    }))}
                    id="discount"
                    name="discount"
                  >
                    <SelectTrigger className="w-full bg-white! py-6 text-xl!">
                      <SelectValue placeholder="Pret intreg" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false" className="text-xl!">Pret Intreg</SelectItem>
                      <SelectItem value="true" className="text-xl!">La reducere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3">
              <DialogClose
                onClick={() => {
                  // setCurrentFiltering({})
                  setFilterDialog(false)
                  setFilters({
                    genre: "",
                    minPrice: 0,
                    maxPrice: 9999,
                    discount: false
                  })
                }}
                className="flex-1/2 text-xl cursor-pointer text-[var(--color-primary)] bg-[#d9d9d9] hover:bg-[#d9d9d9] border-1" >
                Reseteaza
              </DialogClose>
              <Button
                onClick={handleFilterChange} 
                disabled={isFiltering}
                className="flex-1/2 text-xl cursor-pointer bg-[var(--color-primary)] border-1"
              >
                {isFiltering ? (
                  <IconLoader2 className="rotate" />
                ) : (
                  "Aplica"
                )}
                
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={sortDialog} onOpenChange={setSortDialog}>
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
              <DialogDescription>
                {sortingOptions.map((op, i) => (
                  <div key={i}>
                    <Separator className={"my-1"} />
                    <div
                      onClick={() => setCurrentSorting(op)} 
                      className="flex items-center gap-3 text-xl px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <op.icon />
                      <span>{op.label}</span>
                      {currentSorting?.id === op.id && (
                        <IconCheck className="ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex gap-2 mt-12">
              <DialogClose
                onClick={() => {
                  // setCurrentSorting({})
                  setSortDialog(false)
                  setSort({
                    field: "",
                    order: 1
                  })
                }}
                className="flex-1/2 text-xl cursor-pointer text-[var(--color-primary)] bg-[#d9d9d9] hover:bg-[#d9d9d9] border-1" >
                Reseteaza
              </DialogClose>
              <Button
                onClick={handleSortChange} 
                disabled={isSorting}
                className="flex-1/2 text-xl cursor-pointer bg-[var(--color-primary)] border-1"
              >
                {isSorting ? (
                  <IconLoader2 className="rotate" />
                ) : (
                  "Aplica"
                )}
                
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