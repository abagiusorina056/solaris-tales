"use client"

import { Separator } from '@src/components/ui/separator'
import React, { useState } from 'react'
import UserAuthorCard from '../../UserAuthorCard'
import ReviewsTab from '@src/components/data-table/tabs/ReviewsTab'
import { useUsers } from '@src/hooks/useUsers'
import UserAuthorSkeleton from '@src/components/skeletons/admin/UserAuthorSkeleton'
import { socket } from '@src/lib/socketClient'

const UserView = ({ id }) => {
  const {
    users: user
  } = useUsers({}, `/api/admin/users/${id}`)
  const [userState, setUserState] = useState(user)

  React.useEffect(() => {
    socket.on("userUpdated", (updatedUser) => {
      setUserState(updatedUser)
    })

    return () => {
      socket.off("userUpdated")
    }
  }, [])

  React.useEffect(() => {
    if (user && user._id) {
      setUserState(user)
    }
  }, [user])

  return !user._id && !userState._id ? (
    <UserAuthorSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        {userState?._id && <UserAuthorCard user={userState} />}

        <Separator className={"mt-12 mb-8"} />

        <h3 className='text-4xl font-extrabold mb-6'>Review-uri:</h3>
          <ReviewsTab 
            endpoint={`/api/admin/users/${id}/reviews`} 
            active={false}
          />
      </div>
    </div>
  )
}

export default UserView