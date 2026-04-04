"use client"

import ManuscriptsSkeleton from '@src/components/skeletons/admin/ManuscriptsSkeleton'
import { Button } from '@src/components/ui/button'
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@src/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@src/components/ui/dropdown-menu'
import { Input } from '@src/components/ui/input'
import { useRequests } from '@src/hooks/useRequests'
import { deleteManuscript } from '@src/lib/admin'
import { socket } from '@src/lib/socketClient'
import { cn } from '@src/lib/utils'
import { 
  IconDots, IconDownload, 
  IconExternalLink, IconLoader2, 
  IconScriptX, IconTrash, IconX 
} from '@tabler/icons-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const ManuscriptsView = () => {
  const {
    requests,
    totalRequests,
    search: searchRequests,
    setSearch: setSearchRequests,
    reload: reloadRequests,
    loading
  } = useRequests()

  useEffect(() => {
    socket.on("manuscriptDeleted", () => {
      reloadRequests()
    })

    return () => {
      socket.off("manuscriptDeleted")
    }
  }, [reloadRequests])

  const publicIds = requests.map(r => {
    let lastSlash = r.pdfDocument.lastIndexOf("/")
    return r.pdfDocument.slice(lastSlash + 1)
  })
  
  return requests.length === 0 && loading ? (
    <ManuscriptsSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        <div className="flex items-center mb-8">
          <Input
            placeholder="Caută..."
            value={searchRequests}
            onChange={e => setSearchRequests(e.target.value)}
            className="w-64"
          />
          <Button 
            variant="ghost"
            disabled={!searchRequests.length}
            onClick={() => setSearchRequests("")}
            className={"cursor-pointer"}
          >
            <IconX size={32} />
          </Button>
          {requests.length === 0 && searchRequests.length === 0 ? (
            <IconLoader2 className='rotate mr-2' />
          ) : (
            <span className='opacity-50 ml-auto'>{totalRequests} rezultate</span>
          )}
        </div>

        <div className={cn(requests.length ? 'grid grid-cols-3 gap-32' : "w-full")}>
          {requests.length ? requests.map((r, i) => r?.pdfDocument && (
            <ManuscriptCard 
              key={i} 
              request={r} 
              pId={publicIds[i]} 
              sender={r.user}
              reload={reloadRequests}
            />
          )) : (
            <div className='flex flex-col w-full h-full gap-16 items-center justify-center opacity-70'>
              <IconScriptX size={200} />
              <h1 className='opacity text-6xl'>Nu exista rezultate</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ManuscriptCard = ({ request, pId, sender, reload }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true)

    await deleteManuscript(request._id, pId)
    setIsDeleting(false)
    setDeleteDialog(false)
  }

  return (
    <div className='flex flex-col gap-2 col-span-1 pt-4 pb-8 px-6 bg-gray-200 rounded-md'>
      <div className='flex w-full items-center justify-between'>
        <span className='text-gray-500'>{pId}</span>
        <DropdownMenu align="end">
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              className={"cursor-pointer"}
            >
              <IconDots size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className={"flex items-center gap-2"}>
              <IconDownload size={24} />
              <Link href={request.pdfDocument} >
                <span>Descarca</span>
              </Link>
            </DropdownMenuItem >
            <DropdownMenuItem className={"flex items-center gap-2"}>
              <IconExternalLink size={24} />
              <Link href={`https://docs.google.com/gview?url=${request.pdfDocument}`} target="_blank">
                <span>Deschide intr-o fila noua</span>
              </Link>
            </DropdownMenuItem >
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    setDeleteDialog(true)
                  }}
                  className={"flex items-center gap-2 text-red-500! hover:text-red-500"}
                >
                  <IconTrash size={24} className='text-red-500' />
                  <span>Sterge</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[680px]">
                <DialogHeader>
                  <DialogTitle>Atentie</DialogTitle>
                </DialogHeader>
                <DialogDescription className={"flex flex-col gap-4"}>
                  <span className='text-xl'>
                    Urmeaza sa stergi aceast manuscris
                  </span>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                    Anuleaza
                  </DialogClose>
                  <Button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="cursor-pointer text-white bg-red-500 hover:bg-red-500 rounded-sm px-4 py-1 border-1"
                  >
                    {isDeleting ? (
                      <IconLoader2 className="rotate" />
                    ) : (
                      <span>Sterge</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* <DropdownMenuItem className={"flex items-center gap-2 text-red-500! hover:text-red-500"}>
              <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogTrigger>
                  <div className={"flex items-center gap-2"}>
                    <IconTrash size={24} className='text-red-500' />
                    <span>Sterge</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[680px]">
                  <DialogHeader>
                    <DialogTitle>Atentie</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className={"flex flex-col gap-4"}>
                    <span className='text-xl'>
                      Urmeaza sa stergi aceast manuscris
                    </span>
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                      Anuleaza
                    </DialogClose>
                    <Button
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="cursor-pointer text-white bg-red-500 hover:bg-red-500 rounded-sm px-4 py-1 border-1"
                    >
                      {isDeleting ? (
                        <IconLoader2 className="rotate" />
                      ) : (
                        <span>Sterge</span>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <iframe
        src={`https://docs.google.com/gview?url=${request.pdfDocument}&embedded=true`}
        className='pointer-events-none aspect-[1/1.5]'
      />
      <div>
        <p className='font-extrabold'>{request.title}</p>
        <div className='flex items-center gap-2'>
          <p>
            {sender.firstName + " " + sender.lastName}
          </p>
          <span>•</span>
          <p>{request.phoneNumber}</p>
        </div>
      </div>
    </div>
  )
}

export default ManuscriptsView