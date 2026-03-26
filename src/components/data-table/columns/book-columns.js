"use client"

import Link from "next/link"
import { Button } from "@src/components/ui/button"
import { IconTrash, IconEye, IconCircleDashed } from "@tabler/icons-react"
import Image from "next/image"
import { format } from "date-fns"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog"
import { ro } from "date-fns/locale"
import { deleteBook } from "@src/lib/admin"

export function bookColumns (handleDelete) {
  return [
    {
      accessorKey: "title",
      header: "Titlu",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.image}
            width={300}
            height={300}
            className="w-4 aspect-[1/1.5] object-cover object-center"
            alt=""
          />
          <Link
            href={`/admin/carte/${row.original.id}`}
          >
            <span className="hover:underline font-semibold">
              {row.original.title}
            </span>
          </Link>
        </div>
      )
    },
    {
      accessorKey: "author",
      header: "Autor",
      cell: ({ row }) => row.original.isAuthorActive ? (
        <Link href={`/admin/autor/${row.original.authorId}`}>
          <span className="hover:underline">{row.original.author}</span>
        </Link>
      ) : (
        <span>{row.original.author}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Preț",
      cell: ({ row }) => (
        <span>{row.original.price} RON</span>
      ),
    },
    {
      accessorKey: "releaseDate",
      header: "Data lansării",
      cell: ({ row }) => (
        <span>
          {format(row.original.releaseDate, "dd.MM.yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Adăugată la",
      cell: ({ row }) => (
        <span>
          {format(row.original.createdAt, "dd.MM.yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Link href={`/admin/carte/${row.original.id}`}>
              <IconEye size={18} />
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={row.getIsSelected()}
                onClick={handleDelete}
              >
                <IconTrash color="#ff5252" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Atentie</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <span>Urmeaza sa stergi urmatoarea carte:</span>
                <span className="flex items-center gap-3 mt-2">
                  <IconCircleDashed width={"16"} height={"16"} />
                  <>
                    <Image
                      src={row.original.image}
                      width={300}
                      height={300}
                      className="w-6 aspect-[1/1.5] object-cover object-center"
                      alt=""
                    />
                    <span className="text-xl text-black">{row.original.title}</span>
                  </>
                  <span className="text-lg">•</span>
                  <span className="flex items-center gap-1">
                    <span className="bg-gray-200 text-gray-500 rounded-sm px-2 py-1">id</span>
                    <span>{row.original.id}</span>
                  </span>
                </span>
              </DialogDescription>
              <DialogFooter>
                <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                  Anuleaza
                </DialogClose>
                <Button
                  onClick={() => deleteBook(row.original.id)}
                  className="cursor-pointer text-white rounded-sm px-4 py-1 bg-red-500 hover:bg-red-500 border-1"
                >
                  Sterge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ]
}