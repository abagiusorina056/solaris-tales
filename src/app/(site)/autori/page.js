"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
  FaSearch,
  FaSortAmountDown,
  FaInstagram,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { BsEnvelope } from "react-icons/bs";
import { LuFacebook } from "react-icons/lu";
import PageTitle from "../../components/PageTitle";
import { useRouter } from "next/navigation";
import authorDefaultImg from "@public/default-profile-pic.png"
import { IconInfoCircle } from "@tabler/icons-react";
import { useAuthors } from "@src/hooks/useAuthors";
import AuthorsSkeleton from "@src/components/skeletons/site/AuthorsSkeleton";

const ITEMS_PER_PAGE = 12
const PAGE_WINDOW = 3

const AuthorsView = () => {
  const {
    authors,
    page,
    setPage,
    totalAuthors,
    search,
    setSearch,
    loading,
    reload
  } = useAuthors({}, `/api/authors`)
  const ref = useRef(null)
  const totalPages = Math.ceil(totalAuthors / ITEMS_PER_PAGE);

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
        <Button
          variant="default"
          className="text-[var(--color-primary)] bg-[#F0DECA] hover:bg-[#E6C6A1] rounded-none text-xl cursor-pointer rounded-r-sm"
          type="button"
        >
          <FaSortAmountDown size={24} className="mr-2" />
          <span>Sorteaza</span>
        </Button>
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
  const router = useRouter()
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