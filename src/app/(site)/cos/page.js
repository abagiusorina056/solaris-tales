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

const BagView = () => {
  const { user } = useUser()
  const [bagContent, setBagContent] = useState(user?.bagBooks)
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

    return sum + price * quantity;
  }, 0);
  const [total, setTotal] = useState(inTotal)

  const handleClick = (bookId, action) => bagItem(bookId, user._id, action)

  useEffect(() => {
    socket.on("bag", ({ newBagContent, newQuantities, newTotal }) => {
      setBagContent(newBagContent)
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
                <TableHead className="font-bold! text-white! py-4">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bagContent.map((product, i) => (
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
                  <TableCell className="text-2xl">{product?.price} RON</TableCell>
                  <TableCell className="text-2xl">{(parseFloat(product?.price) * productQuantities[product?._id]).toFixed(2)} RON</TableCell>
                  <TableCell className="text-2xl">
                    <Button 
                      onClick={() => handleClick(product?._id, "delete")}
                      className="cursor-pointer bg-transparent hover:bg-transparent text-red-500">
                      <FaRegTrashCan size={32} className="scale-150" />
                    </Button>         
                  </TableCell>
                </TableRow>
              ))}
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
        <p className='w-full text-right px-4 text-xl font-semibold text-[var(--color-rprimary)]'>Adauga produse de încă 100 lei pentru a beneficia de transport gratuit</p>
        <div className='w-full px-10 flex items-start justify-between mt-4'>
            <p className='text-xl text-[var(--color-primary)] font-semibold'>Produsul va fi livrat aproximativ la data de 11 octombrie.</p>
            <Button
                variant="default"
                type="button"
                className="text-white hover:bg-[var(--color-primary)] bg-[var(--color-primary)] font-extrabold uppercase py-6 rounded-none text-xl cursor-pointer border-l-2 border-[var(--color-primary)]"
            >
                Finalizeaza comanda
            </Button>
        </div>          
        </div>
      ): (
        <p>Nimic</p>
      )}
    </div>
  )
}

export default BagView