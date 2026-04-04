import React from 'react'
import AuthorView from './AuthorView';

const AdminAuthor = async ({ params }) => {
  const { id } = await params

  return (
    <AuthorView id={id} />
  )
}

export default AdminAuthor