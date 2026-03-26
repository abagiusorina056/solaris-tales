import { User } from '@src/models/User';
import React from 'react'
import UserView from './UserView';
import { StarReview } from '@src/models/StarReview';
import { connectDB } from '@src/lib/mongodb';

const AdminUser = async ({ params }) => {
  const { id } = await params

  return (
    <UserView id={id} />
  )
}

export default AdminUser