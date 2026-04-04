import Image from "next/image"
import { 
  IconCircleDashed, 
  IconStarFilled, 
  IconTrash 
} from "@tabler/icons-react"
import { Button } from "@src/components/ui/button"
import defaultProfilePic from "@public/default-profile-pic.png"
import Link from "next/link"
import { format } from "date-fns"
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@src/components/ui/dialog"
import { deleteAuthor } from "@src/lib/admin"

export function authorColumns(handleDelete) {
  return [
    {
      accessorKey: "name",
      header: "Autor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.profileImage || defaultProfilePic}
            width={24}
            height={24}
            className="rounded-full"
            alt=""
          />
          <Link href={`/admin/autor/${row.original.id}`}>
            <span className="hover:underline">{row.original.name}</span>
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email ? (
        <Link href={`mailto:${row.original.email}`}>
          <span className="hover:underline">{row.original.email}</span>
        </Link>
      ) : (
        <span>-</span>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconStarFilled color="#fdc700" size={16} />
          <span>{row.original.rating}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Creat la",
      cell: ({ row }) => (
        <span>{format(row.original.createdAt, "dd.MM.yyyy")}</span>
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
                onClick={() => deleteAuthor(row.original.id)}
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