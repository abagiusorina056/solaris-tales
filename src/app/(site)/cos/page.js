"use client"

import React, { use, useEffect, useState } from 'react'
import PageTitle from '@src/app/components/PageTitle';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import Image from 'next/image';
import { truncateText } from '@src/lib/utils';
import { Button } from '@src/components/ui/button';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Input } from '@src/components/ui/input';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { socket } from '@src/lib/socketClient';
import { bagItem } from '@src/lib/user';
import { useUser } from '@src/hooks/useUser';
import { BsBagX } from 'react-icons/bs';
import Link from 'next/link';

const BagView = () => {
  const { data: user, invalidateUser } = useUser()
  const bagContent = user?.bagBooks || []
  const [productQuantities, setProductQuantities] = useState(() => {
    let quantities = []
    user?.bagProducts.forEach(item => {
      quantities[item?.productId] = item?.quantity;
    })

    return quantities
  })

  const inTotal = bagContent.reduce((sum, product) => {
    const quantity = productQuantities[product?._id] ?? 1;
    const price = Number(product?.price) || 0;
    const finalPrice = product?.discount
      ? ((100 - parseInt(product.discount)) * price / 100)
      : price

    return sum + finalPrice * quantity;
  }, 0);

  const [total, setTotal] = useState(inTotal)

  const handleClick = (bookId, action) => bagItem(bookId, user._id, action)

  useEffect(() => {
    socket.on("bag", ({ newBagContent, newQuantities, newTotal }) => {
      invalidateUser()
      setProductQuantities(newQuantities)
      setTotal(parseFloat(newTotal))
    })

    return () => {
      socket.off("bag")
    }
  })

  return (
    <div className="w-full">
      <PageTitle title="Cos"></PageTitle>

      {bagContent.length ? (
        <div className="px-16 pt-8">
          <Table className="mb-4">
            <TableHeader className="bg-[var(--color-primary)]">
              <TableRow className="text-3xl">
                <TableHead></TableHead>
                <TableHead className="font-bold! text-white! py-4">Produs</TableHead>
                <TableHead className="font-bold! text-white! py-4">Disponibilitate</TableHead>
                <TableHead className="font-bold! text-white! py-4">Cantitate</TableHead>
                <TableHead className="font-bold! text-white! py-4">Pret</TableHead>
                <TableHead className="font-bold! text-white! py-4">Subtotal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bagContent.map((product, i) => {
                const finalPrice = product?.discount
                  ? ((100 - parseInt(product.discount)) * parseFloat(product?.price) / 100)
                  : product?.price

                return (
                  <TableRow key={i} className="font-semibold">
                    <TableCell>
                      <Image
                        src={product?.image}
                        width={200}
                        height={200}
                        className='max-w-30'
                        alt=''
                      />
                    </TableCell>
                    <TableCell className="text-2xl">
                      <h1 className='text-3xl'>{truncateText(product?.title, 25)}</h1>
                      <h2 className='text-[var(--color-primary)]'>{product?.author}</h2>
                    </TableCell>
                    <TableCell className="text-2xl">In stoc</TableCell>
                    <TableCell className="text-2xl">
                      <div className='flex-items-center'>
                        <Button 
                          onClick={() => handleClick(product?._id, productQuantities[product?._id] > 1 ? "remove" : "delete")}
                          className="cursor-pointer bg-transparent hover:bg-transparent text-black border rounded-r-none"
                        >
                          <FaMinus size={32} />
                        </Button>
                        <span className='px-4'>{productQuantities[product?._id]}</span>
                        <Button 
                          onClick={() => handleClick(product?._id, "add")}
                          className="cursor-pointer bg-transparent hover:bg-transparent text-black border rounded-r-none"
                        >
                          <FaPlus size={32} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-2xl">
                      <div className='relative'>
                        {product?.discount && (
                          <span className='text-[#fb6767] text-base absolute -top-5'>-{product.discount}%</span>
                        )}
                        <p>{parseFloat(finalPrice).toFixed(2)} RON</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-2xl">{(parseFloat(finalPrice) * productQuantities[product?._id]).toFixed(2)} RON</TableCell>
                    <TableCell className="text-2xl">
                      <Button 
                        onClick={() => handleClick(product?._id, "delete")}
                        className="cursor-pointer bg-transparent hover:bg-transparent text-red-500">
                        <FaRegTrashCan size={32} className="scale-150" />
                      </Button>         
                    </TableCell>
                  </TableRow>
              )})}
            </TableBody>
          </Table>  
          <div className='w-full flex items-center justify-between px-10 py-8 bg-[var(--color-primary)] text-white font-extrabold'>
            <div className='flex items-center'>
                <Input
                    type="text"
                    className="bg-white rounded-none"
                />
                <Button
                    variant="default"
                    type="button"
                    className="bg-white hover:bg-white text-[var(--color-primary)] font-extrabold uppercase rounded-none text-xl cursor-pointer border-l-2 border-[var(--color-primary)]"
                >
                    Aplica voucher
                </Button>
            </div>
            <div className='flex items-center text-2xl gap-4'>
                <span>Total: </span>
                <span>{total.toFixed(2)} RON</span>
            </div>
        </div>
        <Link
          href="/finalizare-comanda"
          variant="default"
          type="button"
          className="flex justify-center w-fit mt-8 mr-10 ml-auto hover:bg-[var(--color-primary)] bg-[var(--color-primary)] font-extrabold uppercase py-2 px-4 rounded-none text-xl cursor-pointer"
        >
          <span className='text-white'>Finalizeaza comanda</span>
        </Link>
      </div>
      ): (
        <div className='flex flex-col items-center justify-center gap-4 text-[var(--color-primary)] py-40'>
          <BsBagX size={150} className='opacity-70' />
          <p className='text-3xl'>Inca nu ai niciun produs in cos</p>
        </div>
      )}
    </div>
  )
}

export default BagView