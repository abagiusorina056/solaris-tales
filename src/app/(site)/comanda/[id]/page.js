import React from 'react'
import OrderView from './OrderVIew'
import { connectDB } from '@src/lib/mongodb'
import { Order } from '@src/models/Order'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'

const page = async ({ params }) => {
  const { id } = await params

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  
  if (!isValidId) {
    return notFound(); 
  }

  await connectDB()
  const exists = await Order.exists({ _id: id })
  
  if (!exists) {
    return notFound()
  }
  
  return (
    <OrderView id={id} />
  )
}

export default page