import React from 'react'
import UserView from './UserView';

const AdminUser = async ({ params }) => {
  const { id } = await params

  return (
    <UserView id={id} />
  )
}

export default AdminUser