"use client"

import PageTitle from '@src/app/components/PageTitle'
import { Button } from '@src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@src/components/ui/card'
import { Separator } from '@src/components/ui/separator'
import { useOrders } from '@src/hooks/useOrders'
import { useUser } from '@src/hooks/useUser'
import { truncateText } from '@src/lib/utils'
import { IconBuildingBank, IconCashBanknote, IconCheck, IconClipboard, IconCreditCard, IconLoader2, IconStar } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const OrderView = ({ id }) => {
  const { user } = useUser()
  const [copied, setCopied] = React.useState(false)
  const [isCancelling, setIsCancelling] = React.useState(false)
  const { orders: order } = useOrders({}, `/api/order/${id}?user=${user._id}`)
  
  return (
    <>
      <PageTitle title={"Comanda"} />
      <div className='w-full pt-16'>
        <div className='w-full px-16'>
          <div className='flex items-center text-4xl gap-3 mb-4'>
            <h1>Comanda</h1>
            {order.slug && (
              <div className="flex gap-1 items-center">
                <span className="bg-gray-200 text-gray-500 text-3xl w-fit rounded-sm px-2 py-1">
                  {order.slug}
                </span>
                {copied ? (
                  <IconCheck  
                    size={24}
                    className="text-gray-400"
                  />
                ) : (
                  <IconClipboard 
                    size={24} 
                    cursor="pointer"
                    className=" text-gray-400"
                    onClick={() => 
                      navigator.clipboard.writeText(order.slug)
                      .then(() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 5000)
                      })
                    }
                  />
                )}
              </div>
            )}
          </div>
          <div className='flex gap-16 w-full flex-nowrap overflow-x-auto scrollbar-hide pb-6'>
            {order._id && order.products.map((book, i) => {
              const targetBook = order.booksOrdered.find(b => book.bookId === b._id)

              return (
                <div key={i} className='w-1/6 shrink-0'>
                  <Image
                    src={targetBook?.image}
                    width={200}
                    height={200}
                    className='w-full aspect-[1/1.5] object-cover object-center'
                    alt={targetBook?.title}
                  />
                  <p className='font-semibold text-xl'>{truncateText(targetBook.title, 30)}</p>
                  <div className='flex justify-between w-full text-lg'>
                    <span>{targetBook.price} RON</span>
                    <span className='opacity-40'>x{book.quantity}</span>
                  </div>
                </div>
              )
            })}
          </div>
          {order._id && (
            <Card className="mx-auto mt-8 w-full font-semibold">
              <CardHeader>
                <CardTitle className={"text-center text-2xl"}>Sumar Comanda {order.slug}</CardTitle>
              </CardHeader>
              <CardContent className={"flex items-center"}>
                <div className='flex-1/2 border-black border-r-1 px-6'>
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]" >Nume:</h2>
                    <span>{order.name}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]">Email:</h2>
                    <span>{order.email}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]">Telefon:</h2>
                    <span>
                      {
                        order.phone[0] === "0" 
                        ? "+4" +  order.phone 
                        : "+40" + order.phone
                      }
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]">Pret produse:</h2>
                    <span>{order.price} RON</span>
                  </div>
                  <Separator className="my-1" />
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]">Adresa de livrare:</h2>
                    <span>{order.shippingAdress}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className='w-full flex items-baseline justify-between'>
                    <h2 className="text-[var(--color-primary)]">Adresa de facturare:</h2>
                    <span>{order.billingAdress}</span>
                  </div>
                </div>

                <Separator orientation='vertical' />

                <div className='flex items-center justify-center flex-col flex-1/2'>
                  <h1 className='text-3xl uppercase'>Total:</h1>
                  <span className='text-3xl mb-4 text-[var(--color-primary)]'>{order.price} RON</span>

                  {order.paymentMethod === "cash"
                    ? (
                      <div className='flex items-center justify-center gap-2 w-fit rounded-full border-black border-2 text-xl px-4'>
                        <IconCashBanknote size={28} />
                        <span className="text-lg">•</span>
                        <span>Ramburs (cash)</span>
                      </div>
                    ) : (
                      <div className='flex items-center justify-center gap-2 w-fit rounded-full border-black border-2 text-xl px-4'>
                        <IconCreditCard size={28} />
                        <span className="text-lg">•</span>
                        <span>Online (card)</span>
                      </div>
                    )
                  }
                </div>
              </CardContent>
              
              {order.status === "processing" && (
                <>
                  <Separator />
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="w-1/2 mx-auto py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-xl hover:text-white cursor-pointer"
                        >
                          Anuleaza Comanda
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[680px]">
                        <DialogHeader>
                          <DialogTitle>Atentie</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className={"flex flex-col gap-4"}>
                          <span className='text-xl'>
                            Esti sigur ca vrei sa anulezi Comanda {order.slug}?
                          </span>
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                            Renunta
                          </DialogClose>
                          <Button
                            disabled={isCancelling}
                            // onClick={handleDelete}
                            className="cursor-pointer text-white bg-red-500 hover:bg-red-500 rounded-sm px-4 py-1 border-1"
                          >
                            {isCancelling ? (
                              <IconLoader2 className="rotate" />
                            ) : (
                              <span>Anuleaza Comanda</span>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

export default OrderView