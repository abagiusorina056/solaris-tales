"use client"

import { Button } from '@src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@src/components/ui/card'
import { Separator } from '@src/components/ui/separator'
import { useOrders } from '@src/hooks/useOrders'
import { orderStatusMap, truncateText } from '@src/lib/utils'
import { 
  IconCashBanknote, IconCheck, 
  IconClipboard, IconCreditCard, 
  IconLoader2, IconPencil
 } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'
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
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput 
} from '@src/components/ui/input-group'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@src/components/ui/select'
import { updateOrder, validateUpdateOrderForm } from '@src/lib/admin'
import { socket } from '@src/lib/socketClient'
import OrderSkeleton from '@src/components/skeletons/OrderSkeleton'
import { toast } from 'sonner'

const OrderView = ({ id }) => {
  const { orders: order } = useOrders({}, `/api/admin/orders/${id}`)
  
  const defaultValues = {
    name: order.name || "",
    email: order.email || "",
    phone: order.phone || "",
    shippingAdress: order.shippingAdress || "",
    billingAdress: order.billingAdress || ""
  }
  const [copied, setCopied] = React.useState(false)
  const [orderData, setOrderData] = React.useState(order)
  const [updateForm, setUpdateForm] = React.useState(defaultValues)
  const [updateDialog, setUpdateDialog] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isStatusUpdating, setIsStatusUpdating] = React.useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusUpdate = async (e) => {
    setIsStatusUpdating(true)

    updateOrder(order._id, { status: e })
      .then(() => {
        toast.success("Status actualizat cu succes")
        setIsStatusUpdating(false)
      })
  }

  const handleUpdate = async () => {
    const isValid = validateUpdateOrderForm(updateForm)
    if (!isValid) {
      return
    }

    setIsUpdating(true)

    await updateOrder(order._id, updateForm)

    setUpdateDialog(false)
    setIsUpdating(false)
  }

  React.useEffect(() => {
    socket.on("orderUpdated", (updatedOrder) => {
      setOrderData(updatedOrder)
    })
  }, [])

  React.useEffect(() => {
    if (order && order._id) {
      setOrderData(order);

      setUpdateForm({
        name: order.name || "",
        email: order.email || "",
        phone: order.phone || "",
        shippingAdress: order.shippingAdress || "",
        billingAdress: order.billingAdress || ""
      });
    }
  }, [order])
  
  return !order._id && !orderData._id ? (
    <OrderSkeleton />
  ) : (
    <div className='w-full pt-16'>
      <div className='w-full px-16'>
        <div className='flex items-center text-4xl mb-4 justify-between'>
          <span className='flex items-center gap-4'>
            <h1>Comanda</h1>
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
          </span>

          <div className='flex items-center gap-4'>
            {isStatusUpdating && (
              <IconLoader2 size={28} className='rotate' />
            )}
            <h1 className='text-2xl'>Status:</h1>
            <Select 
              disabled={orderData?.status === "canceled" || isStatusUpdating} 
              onValueChange={(e) => handleStatusUpdate(e)}
            >
              <SelectTrigger className="w-max">
                <SelectValue placeholder={orderStatusMap[orderData.status]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(orderStatusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex gap-16 w-full flex-nowrap overflow-x-auto scrollbar-hide pb-6'>
          {order?.products?.map((book, i) => {
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
        <Card className="mx-auto mt-8 w-full font-semibold">
          <CardHeader>
            <CardTitle className={"text-center text-2xl"}>Sumar Comanda {order.slug}</CardTitle>
          </CardHeader>
          <CardContent className={"flex items-center"}>
            <div className='flex-1/2 border-black border-r-1 px-6'>
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray" >Nume:</h2>
                <span>{order.name}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray">Email:</h2>
                <span>{order.email}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray">Telefon:</h2>
                <span>
                  {
                    (orderData?.phone || "")[0] === "0"
                      ? "+4" +  orderData.phone 
                      : "+40" + orderData.phone
                  }
                </span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray">Pret produse:</h2>
                <span>{order.price} RON</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray">Adresa de livrare:</h2>
                <span>{orderData.shippingAdress}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-gray">Adresa de facturare:</h2>
                <span>{orderData.billingAdress}</span>
              </div>
            </div>

            <Separator orientation='vertical' />

            <div className='flex items-center justify-center flex-col flex-1/2'>
              <h1 className='text-3xl uppercase'>Total:</h1>
              <span className='text-3xl mb-4 text-gray'>{order.price} RON</span>

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
          
          {orderData.status === "processing" && (
            <>
              <Separator />
              <CardFooter>
                <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-1/2 mx-auto py-1 hover:bg-gray/90  cursor-pointer"
                    >
                      <IconPencil />
                      <span>Editeaza Comanda</span>
                    </Button>
                  </DialogTrigger>
                  {/* <DialogContent className="sm:max-w-[680px]"> */}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editeaza Comanda {order.slug}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className={"flex flex-col gap-4"}>
                      <span className='!text-2xl flex-1/2'>
                        <span>Nume</span>
                        <Input
                          placeholder=""
                          type="text"
                          name="name"
                          id="name-preview"
                          value={updateForm.name}
                          onChange={handleChange}
                          className="w-full !text-2xl"
                        />
                      </span>
                      <span className='!text-2xl flex-1/2'>
                        <span>Email</span>
                        <Input
                          placeholder=""
                          type="text"
                          name="email"
                          id="email-preview"
                          value={updateForm.email}
                          onChange={handleChange}
                          className="w-full !text-2xl"
                        />
                      </span>
                      <span className='!text-2xl flex-1/2'>
                        <span>Telefon</span>
                        <InputGroup className="py-6 bg-transparent placeholder:select-none">
                          <InputGroupAddon align="inline-start" className={"border-r-1 pr-2 border-gray-400"}>
                            <Image
                              src={"/flag.jpeg"}
                              width={20}
                              height={20}
                              className="h-full w-auto rounded-sm"
                              alt='Romania'
                            />
                            <span className='text-xl'>+40</span>
                          </InputGroupAddon>
                          <InputGroupInput 
                            placeholder="Telefon"
                            type="number"
                            name="phone"
                            id="phone"
                            value={updateForm.phone}
                            onChange={handleChange}
                            className="!text-xl"
                          />
                        </InputGroup>
                      </span>
                      <span className='!text-2xl flex-1/2'>
                        <span>Adresa de livrare</span>
                        <Input
                          placeholder=""
                          type="text"
                          name="shippingAdress"
                          id="shippingAdress-preview"
                          value={updateForm.shippingAdress}
                          onChange={handleChange}
                          className="w-full !text-2xl"
                        />
                      </span>
                      <span className='!text-2xl flex-1/2'>
                        <span>Adresa de facturare</span>
                        <Input
                          placeholder=""
                          type="text"
                          name="billingAdress"
                          id="billingAdress-preview"
                          value={updateForm.billingAdress}
                          onChange={handleChange}
                          className="w-full !text-2xl"
                        />
                      </span>
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                        Renunta
                      </DialogClose>
                      <Button
                        disabled={isUpdating}
                        onClick={handleUpdate}
                        className="cursor-pointer rounded-sm px-4 py-1 border-1"
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
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default OrderView