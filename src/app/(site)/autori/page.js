"use client";

import React, { 
  useMemo, 
  useRef, 
  useState 
} from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
  FaSearch,
  FaSortAmountDown,
  FaStar,
} from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@src/components/ui/pagination";
import { MdOutlineSearchOff } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "../../components/PageTitle";
import authorDefaultImg from "@public/default-profile-pic.png"
import { 
  IconCheck, 
  IconInfoCircle, 
  IconLoader2, 
  IconSortAZ, 
  IconSortZA, 
  IconStarFilled, 
  IconStarHalfFilled 
} from "@tabler/icons-react";
import { useAuthors } from "@src/hooks/useAuthors";
import AuthorsSkeleton from "@src/components/skeletons/site/AuthorsSkeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { Separator } from "@src/components/ui/separator";

const ITEMS_PER_PAGE = 12
const PAGE_WINDOW = 3
const sortingOptions = [
  {
    id: 1,
    label: "Alfabetic",
    icon: IconSortAZ,
    order: 1,
    field: "name",
  },
  {
    id: 2,
    label: "Alfabetic invers",
    icon: IconSortZA,
    order: -1,
    field: "name",
  },
  {
    id: 3,
    label: "Rating crescator",
    icon: IconStarHalfFilled,
    order: 1,
    field: "rating",
  },
  {
    id: 4,
    label: "Rating descrescator",
    icon: IconStarFilled,
    order: -1,
    field: "rating",
  },
]

const AuthorsView = () => {
  const {
    authors,
    page,
    setPage,
    totalAuthors,
    search,
    setSearch,
    setSort,
  } = useAuthors({}, `/api/authors`)
  const ref = useRef(null)
  const totalPages = Math.ceil(totalAuthors / ITEMS_PER_PAGE);
  const [currentSorting, setCurrentSorting] = useState({})
  const [isSorting, setIsSorting] = useState(false)
  const [sortDialog, setSortDialog] = useState(false)

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

  return authors.length === 0 && search.length === 0 ? (
    <AuthorsSkeleton />
  ) : (
    <div className="w-full flex flex-col items-center" ref={ref}>
      <PageTitle title="Autori" />
      <div className="w-full flex items-center justify-end mt-8 px-8">
        <span className="mr-2 opacity-50">{totalAuthors} rezultate</span>
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

      {authors.length ? (
        <div className="w-full grid grid-cols-4 grid-rows-2 gap-10 px-12 py-6">
          {authors.map((author, index) => (
            <AuthorCard
              key={index}
              author={author}
            />
          ))}
        </div>
      ) : (
        <div className="w-9/10 flex flex-col items-center justify-center bg-white rounde-sm h-[60vh] mt-5 text-[var(--color-primary)]/60">
          <MdOutlineSearchOff size={180} />
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

const AuthorCard = ({ author }) => {
  const authorNameSplit = author.name.split(" ")
  const authorFirstName = authorNameSplit[0]
  const authorLastName = authorNameSplit.slice(1, authorNameSplit.length)

  return (
    <Link
      className="flex flex-col rounded-4xl w-fit mx-auto px-8 py-2 col-span-1 items-center shadow-md transition-all duration-500 ease hover:scale-105 cursor-pointer"
      href={`/autor/${author._id}`}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-1">
          <span className="font-bold text-2xl">{author?.rating || 0}</span>
          <FaStar size={28} className="text-yellow-400" />
        </div>
        <IconInfoCircle size={28} />
      </div>
      <Image
        src={author?.image || authorDefaultImg}
        width={250}
        height={250}
        alt={author.name}
        className="rounded-full"
      />
      <div className="flex items-baseline gap-1 text-2xl mt-4">
        <h1 className="font-semibold">{authorFirstName}</h1>
        <h2 className="font-light flex gap-1">
          {authorLastName.map((n, i) => <span key={i}>{n}</span>)}
        </h2>
      </div>
    </Link>
  );
};

export default AuthorsView;