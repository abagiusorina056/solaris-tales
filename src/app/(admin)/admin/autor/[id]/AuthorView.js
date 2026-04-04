"use client"

import { Separator } from '@src/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@src/components/ui/tabs'
import UserAuthorCard from '../../UserAuthorCard'
import { useAuthors } from '@src/hooks/useAuthors'
import BooksTab from '@src/components/data-table/tabs/BooksTab'
import ReviewsTab from '@src/components/data-table/tabs/ReviewsTab'
import { socket } from '@src/lib/socketClient'
import UserAuthorSkeleton from '@src/components/skeletons/admin/UserAuthorSkeleton'

const AuthorView = ({ id }) => {
  const {
    authors: author,
    reload
  } = useAuthors({}, `/api/admin/authors/${id}`)
  const [authorState, setAuthorState] = useState(author)
  const [title, setTitle] = useState("Carti")

  useEffect(() => {
    socket.on("authorUpdated", (updatedAuthor) => {
      setAuthorState(updatedAuthor)
    })

    return () => {
      socket.off("authorUpdated")
    }
  }, [])

  useEffect(() => {
    if (author && author._id) {
      setAuthorState(author)
    }
  }, [author])

  return !author._id && !authorState._id ? (
    <UserAuthorSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16 mb-8'>
        <UserAuthorCard 
          user={authorState?.user?.[0] || authorState} 
          slug={author.slug}
          reload={reload} 
        />

        <Separator className={"mt-12 mb-8"} />

        <h3 className='text-4xl font-extrabold mb-6'>{title}:</h3>
        <Tabs
          defaultValue="books"
          className="w-full flex-col justify-start gap-6  px-8"
          onValueChange={(value) => setTitle(prev => prev === "Carti" ? "Review-uri": "Carti")}
        >
          <TabsContent
            value="books"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
          >
            <BooksTab 
              endpoint={`/api/admin/authors/${id}/books`}
              isAuthorActive={false}
            >
              <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 md:flex">
                <TabsTrigger value="books">Carti</TabsTrigger>
                <TabsTrigger value="reviews">Review-uri</TabsTrigger>
              </TabsList>
            </BooksTab>
          </TabsContent>
          <TabsContent
            value="reviews"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
          >
            <ReviewsTab 
              endpoint={`/api/admin/authors/${id}/reviews`} 
              options={{ reviewerId: author?.userId }}
              isReviewerActive={false}
            >
              <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 md:flex">
                <TabsTrigger value="books">Carti</TabsTrigger>
                <TabsTrigger value="reviews">Review-uri</TabsTrigger>
              </TabsList>
            </ReviewsTab>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AuthorView