import Image from "next/image"
import { IconBrandFacebook, IconBrandInstagram, IconCircleDashed, IconStarFilled, IconTrash } from "@tabler/icons-react"
import { Button } from "@src/components/ui/button"
import defaultProfilePic from "@public/default-profile-pic.png"
import Link from "next/link"
import { format } from "date-fns"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog"

export function userColumns(handleDelete) {
  return [
    {
      accessorKey: "name",
      header: "Nume",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.profileImage || defaultProfilePic}
            width={24}
            height={24}
            className="rounded-full"
            alt=""
          />
          <Link href={`/admin/utilizator/${row.original.id}`}>
            <span className="hover:underline">{row.original.name}</span>
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Link href={`mailto:${row.original.email}`}>
          <span className="hover:underline">{row.original.email}</span>
        </Link>
      ),
    },
    {
      accessorKey: "dob",
      header: "Data Nasterii",
      cell: ({ row }) => (
        <span>{row.original.dob !== null ? format(row.original.dob, "dd.MM.yyyy") : "-"}</span>
      ),
    },
    {
      accessorKey: "socials",
      header: "Socials",
      cell: ({ row }) => (
        <>
          {(row.original.socials.instagram || row.original.socials.facebook) ? (
            <div className="flex items-center gap-2">
              {row.original.socials.instagram && (
                <Link href={`https://www.instagram.com/${row.original.socials.instagram}`} target="_blank">
                  <IconBrandInstagram />
                </Link>
              )}
              {row.original.socials.instagram && (
                <Link href={`https://facebook.com/${row.original.socials.facebook}`} target="_blank">
                  <IconBrandFacebook />
                </Link>
              )}
            </div>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "S-a alaturat in",
      cell: ({ row }) => (
        <span>{format(row.original.createdAt, "dd.MM.yyyy")}</span>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gen",
      cell: ({ row }) => (
        <span>{row.original.gender === "male" ? "Barbat" : "Femeie"}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atentie</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <span>Urmeaza sa stergi urmatoarul utilizator:</span>
              <span className="flex items-center gap-3 mt-2">
                <IconCircleDashed width={"16"} height={"16"} />
                <span className="text-xl text-black">{row.original.name}</span>
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
                onClick={() => deleteUser(row.original.id)}
                className="cursor-pointer text-white rounded-sm px-4 py-1 bg-red-500 hover:bg-red-500 border-1"
              >
                Sterge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ]
}