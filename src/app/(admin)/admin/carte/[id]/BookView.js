"use client"

import defaultBookPic from "@public/default-book-pic.jpg";
import { Separator } from '@src/components/ui/separator'
import { cn } from '@src/lib/utils'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { 
  IconArrowNarrowRightDashed, IconArticle, 
  IconBlockquote, IconCurrencyDollar, 
  IconLoader2, IconPencil, 
  IconPercentage, IconRotate,
  IconSubtitlesEdit, IconTrash, IconX 
} from '@tabler/icons-react'
import { useBooks } from '@src/hooks/useBooks'
import ReviewsTab from '@src/components/data-table/tabs/ReviewsTab'
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
import { Input } from '@src/components/ui/input'
import { Button } from '@src/components/ui/button'
import { Textarea } from '@src/components/ui/textarea'
import { toast } from 'sonner'
import { deleteBook, updateBook } from '@src/lib/admin'
import { socket } from '@src/lib/socketClient'
import BookSkeleton from '@src/components/skeletons/admin/BookSkeleton'
import { genres } from '@src/lib/genres';

const BookView = ({ id }) => {
  const { 
    books: book 
  } = useBooks({}, `/api/admin/books/${id}`)
  const [bookState, setBookState] = React.useState(book)

  React.useEffect(() => {
    socket.on("bookUpdated", (updatedBook) => {
      setBookState(updatedBook)
    })

    return () => {
      socket.off("bookUpdated")
    }
  }, [])

  React.useEffect(() => {
    if (book && book._id) {
      setBookState(book);
    }
  }, [book])

  return !book._id && !bookState._id ? (
    <BookSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        <BookCard book={bookState} />

        <Separator className={"mt-12 mb-8"} />

        <h3 className='text-4xl font-extrabold mb-6'>Reviews:</h3>
        <ReviewsTab 
          endpoint={`/api/admin/books/${id}/reviews`} 
          isBookActive={false}
        />
      </div>
    </div>
  )
}

const BookCard = ({ book }) => {
  const bookGenre = genres.genres.find(g => g.slug === book?.genre)
  const defaultValues = {
    title: book?.title,
    price: book?.price,
    description: book?.description,
    bookFragments: book?.bookFragments || "",
    discount: book?.discount || 0
  }

  const [formValues, setFormValues] = React.useState(defaultValues)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [editDialog, setEditDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [newPrice, setNewPrice] = React.useState(
    calculateDiscountedPrice(book?.price, book?.discount)
  )

  function calculateDiscountedPrice(price, discount) {
    if (!discount) return price;
    const discountedPrice = price - (price * (discount / 100));
    return discountedPrice.toFixed(2);
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (formValues.discount > 100) {
      toast.error("Discountul nu poate fi mai mare de 100%")
      return;
    }
    
    setIsUpdating(true)
    updateBook(book?._id, formValues)
    .then(() => {
      setEditDialog(false)
      toast.success("Cartea a fost actualizata cu succes")
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteBook(book?._id)
    toast.success("Cartea a fost stearsa cu succes")
    setIsDeleting(false)
  }

  React.useEffect(() => {
    setNewPrice(
      calculateDiscountedPrice(formValues.price, formValues.discount)
    )
  }, [formValues.discount, formValues.price]) 

  return (
    <>
      <Link href={`/admin/autor/${book?.authorId}`}>
        <h2 className='text-2xl font-light'>{book?.author}</h2>
      </Link>
      <h3 className='text-4xl font-extrabold'>{book?.title}</h3>

      <div className='flex gap-18 mt-10.5'>
        <Image
          src={book?.image || defaultBookPic}
          width={300}
          height={300}
          alt={book?.title}
          className='w-68 h-102 drop-shadow-2xl'
        />
        <div className='flex flex-col'>
          <div className='flex items-center gap-4'>
            <div className='font-light text-2xl'>
              Publicata pe {book?.releaseDate ? format(new Date(book.releaseDate), "P", { locale: ro }) : "..."}
            </div>
            <span className="text-2xl">•</span>
            <span className='font-light text-2xl'>{bookGenre?.label}</span>
          </div>
          <p className='text-2xl font-bold mb-12'>
            {book?.description}
          </p>
          <div className='flex items-baseline-last justify-between'>
            <div className='flex flex-col'>
              <span className="bg-gray-200 text-gray-500 text-2xl w-fit rounded-sm px-2 py-1">
                Discount: {book?.discount  ? book?.discount + "%" : "0%"}
              </span>
              <span className='font-extrabold text-6xl'>{book?.price} RON</span>
            </div>
            <div className='flex items-center gap-6'>
              <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogTrigger asChild>
                  <IconPencil
                    size={64}
                    cursor="pointer"
                    className="rounded-md p-1.5 bg-gray-200"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Editeaza</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className={"flex flex-col gap-4"}>
                    <div className='!text-2xl flex-1/2'>
                      <div className="flex items-center gap-1">
                        <IconSubtitlesEdit size={24} />
                        <span>Titlu</span>
                      </div>
                      <Input
                        placeholder=""
                        type="text"
                        name="title"
                        id="title-preview"
                        value={formValues.title}
                        onChange={handleChange}
                        className="w-full !text-2xl"
                      />
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='!text-2xl flex-1/2'>
                        <div className="flex items-center gap-1">
                          <IconCurrencyDollar size={24} />
                          <span>Pret</span>
                        </div>
                        <Input
                          placeholder=""
                          type="number"
                          name="price"
                          id="price-preview"
                          value={formValues.price}
                          onChange={handleChange}
                          className="w-full !text-2xl"
                        />
                      </div>
                      <div className='!text-2xl flex-1/2'>
                        <div className="flex items-center gap-1">
                          <IconPercentage size={24} />
                          <span>Discount</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Input
                            placeholder=""
                            type="number"
                            name="discount"
                            id="discount-preview"
                            value={parseInt(formValues.discount)}
                            onChange={handleChange}
                            className="flex-1/2 !text-2xl"
                          />
                          <span className='text-2xl'>%</span>
                          <IconArrowNarrowRightDashed size={32} className='flex-1/3' />
                          <span className={cn(
                            'text-xl whitespace-nowrap', formValues.discount > 100 && "text-red-500"
                          )}>
                            {newPrice} RON
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center flex-col gap-4'>
                      <div className="w-full !text-2xl flex-1/2">
                        <div className="flex items-center justify-between !text-2xl">
                          <div className="flex items-center gap-1">
                            <IconBlockquote size={24} />
                            <span>Descriere</span>
                          </div>
                          <Button 
                            variant={"ghost"} 
                            size="icon"
                            disabled={!formValues.description}
                            onClick={() => setFormValues(prev => ({
                              ...prev,
                              description: "",
                            }))}
                          >
                            <IconX size={20} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder=""
                          name="description"
                          id="description-preview"
                          value={formValues.description}
                          onChange={handleChange}
                          className="w-full h-34! !text-xl"
                        />
                      </div>
                      <div className="w-full !text-2xl flex-1/2">
                        <div className="flex items-center justify-between !text-2xl">
                          <div className="flex items-center gap-1">
                            <IconArticle size={24} />
                            <span>Fragmente din carte</span>
                          </div>
                          <Button 
                            variant={"ghost"} 
                            size="icon"
                            disabled={!formValues.bookFragments}
                            onClick={() => setFormValues(prev => ({
                              ...prev,
                              bookFragments: "",
                            }))}
                          >
                            <IconX size={20} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder=""
                          name="bookFragments"
                          id="bookFragments-preview"
                          value={formValues.bookFragments}
                          onChange={handleChange}
                          className="w-full h-34! !text-xl"
                        />
                      </div>
                    </div>
                  </DialogDescription>
                  <DialogFooter>
                    <Button 
                      variant={"outline"}
                      onClick={() => setFormValues(defaultValues)}
                    >
                      <IconRotate size={24} />
                    </Button>
                    <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                      Anuleaza
                    </DialogClose>
                    <Button
                      disabled={isUpdating}
                      onClick={handleSubmit}
                      className="cursor-pointer text-white rounded-sm px-4 py-1 border-1"
                    >
                      {isUpdating ? (
                        <IconLoader2 className="rotate" />
                      ) : (
                        <span>Trimite</span>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogTrigger asChild>
                  <IconTrash
                    size={64}
                    cursor="pointer"
                    className="rounded-md p-1.5 bg-gray-200 text-red-500"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[680px]">
                  <DialogHeader>
                    <DialogTitle>Atentie</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className={"flex flex-col gap-4"}>
                    <span className='text-xl'>
                      Urmeaza sa stergi aceasta carte
                    </span>
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                      Anuleaza
                    </DialogClose>
                    <Button
                      disabled={isUpdating}
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookView