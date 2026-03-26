import React from 'react'
import { StarReview } from '@src/models/StarReview';
import { connectDB } from '@src/lib/mongodb';
import { Author } from '@src/models/Authors';
import AuthorView from './AuthorView';

const AdminAuthor = async ({ params }) => {
  const { id } = await params

  return (
    <AuthorView id={id} />
  )
}

export default AdminAuthor