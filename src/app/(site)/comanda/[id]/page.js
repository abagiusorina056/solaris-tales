import React from 'react'
import OrderView from './OrderVIew'

const page = async ({ params }) => {
  const { id } = await params
  
  return (
    <OrderView id={id} />
  )
}

export default page