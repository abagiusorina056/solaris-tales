"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { format } from 'date-fns'
import sorina from "@public/mockup-staff/sorina.png";
import { ro } from 'date-fns/locale'
import { starReviewBook, startReviewBook } from '@src/lib/book'
import StarReviewComponent from './StarReviewComponent'
import ReviewsComponent from './ReviewsComponent'
import { BsBagPlusFill } from 'react-icons/bs'
import { socket } from '@src/lib/socketClient'
import { bagItem, changeFavorite } from '@src/lib/user'
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { useBooks } from '@src/hooks/useBooks'
import { useUser } from '@src/hooks/useUser'
import Link from 'next/link'
import defaultAuthorPic from '@public/default-profile-pic.png'
import BookSkeleton from '@src/components/skeletons/site/BookSkeleton'
import { Separator } from '@src/components/ui/separator'

const BookView = ({ id }) => {
  const { user } = useUser()
  const { books: book } = useBooks({}, `/api/books/${id}`)
  const [allReviews, setAllReviews] = useState([])
  const [authorRating, setAuthorRating] = useState("")


  useEffect(() => {
    socket.on("new-review", (data) => {
      setAllReviews(prev => {
        let filteredReviews = prev.filter(r => r.reviewerId !== user._id)
        filteredReviews.push(data.newReview)

        return filteredReviews
      })
      setAuthorRating(data?.newRating)
    });

    return () => {
      socket.off("new-review");
    };
  })

  useEffect(() => {
    if (book?.reviews) {
      setAllReviews(book.reviews);
    }
  }, [book?.reviews])

  useEffect(() => {
    if (book?.author) {
      setAuthorRating(book.author.rating);
    }
  }, [book?.author])

  return !book._id && allReviews.length === 0 ? (
    <BookSkeleton />
  ) : (
    <div className='pt-16'>
      <div className='px-16'>
        <BookCard 
          book={book} 
          favorites={user?.favorites}
          userId={user?._id}
          authorId={book.author._id}
          review={allReviews.find(r => r.reviewerId === user._id)}
        />
      </div>
      
      <ReviewsComponent allStarReviews={allReviews} />

      {book?.bookFragments && (
        <>
          <Separator className="my-8" />
          <div className='px-16'>
            <h3 className='text-4xl font-extrabold mb-10'>Fragmente din carte:</h3>
            <p className='font-semibold text-2xl'>
              {book.bookFragments}
            </p>
          </div>
        </>
      )}

      <Separator className="my-8" />

      <div className='px-16'>
        <div className='flex items-baseline justify-between mb-12'>
          <div className='flex items-baseline text-4xl'>
            <span className='mr-2'>Despre</span>
            {book.author && <span className='font-extrabold'>{book?.author?.name}</span>}
            <span>:</span>
          </div>
          <div className='text-[var(--color-primary)] font-bold text-2xl'>
            Rating {authorRating} / 5
          </div>
        </div>
        <div className='flex'>
          <div className='w-60 aspect-square rounded-full overflow-hidden mx-10'>
            {book?.author && (
              <Image
                src={book?.author?.image || defaultAuthorPic}
                width={300}
                height={300}
                alt={book?.author?.name}
                className='w-full aspect-square object-cover object-center'
              />
            )}
          </div>
          {(book?.author && book?.author.bio) && (
            <p className='flex-1/2 text-2xl'>
              {book?.author?.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const BookCard = ({ book, favorites, userId, authorId, review }) => {
  const [isFavorite, setIsFavorite] = useState(favorites.includes(book._id))
  const addedRef = useRef(null);

  const handleStarReview = (review) => starReviewBook(book._id, review, userId, authorId)
  const handleAddBagItem = () => {
    bagItem(book._id, userId, "add")

    addedRef.current.classList.add("zoom-in");

    setTimeout(() => {
      if (addedRef.current) addedRef.current.classList.remove("zoom-in");
    }, 500);
  }
  const handleFavorite = (action) => {
    setIsFavorite(action === "like" ? true : false)
    changeFavorite(book._id, userId, action)
  }

  useEffect(() => {
    socket.on("favorite", (data) => {
      setIsFavorite(data.includes(book._id));
    });

    return () => {
      socket.off("favorite");
    };
  }, [book._id])

  return (
    <>
      <Link 
        href={`/autor/${authorId}`}
        className='text-[var(--color-primary)] text-2xl font-extrabold'
      >
        {book.author.name}
      </Link>
      <h3 className='text-4xl font-extrabold'>{book.title}</h3>

      <div className='flex gap-18 mt-10.5'>
        <Image
          src={book.image}
          width={300}
          height={300}
          alt={book.title}
          className='w-68 h-102 drop-shadow-2xl'
        />
        <div className='flex flex-col justify-between flex-1/2'>
          <div className='text-[var(--color-primary)] font-bold text-2xl'>
            Voteaza:
          </div>
          <div className='flex items-center mb-8 gap-1 text-yellow-400'>
            <StarReviewComponent
              review={review?.review || 0}
              handleStarReview={handleStarReview}
              active
              size={36}
            />
          </div>

          <div className='text-[var(--color-primary)] font-bold text-2xl'>
            Publicata pe {format(new Date(book.releaseDate), "P", { locale: ro })}
          </div>
          <p className='text-2xl font-bold mb-12'>
            {book.description}
          </p>
          <div className='flex items-baseline-last justify-between'>
            <div className='flex flex-col'>
              {book?.discount && (
                <span className="bg-[#fb6767] text-white text-2xl w-fit rounded-sm px-2 py-1">
                  Discount: {book?.discount + "%"}
                </span>
              )}
              <span className='font-extrabold text-6xl'>{book.price} RON</span>
            </div>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <BsBagPlusFill
                  size={64}
                  onClick={handleAddBagItem}
                  cursor="pointer"
                  className="bg-[var(--color-primary)] rounded-sm text-white p-1.5"
                />
                <IoCheckmarkCircleSharp
                  ref={addedRef}
                  size={32}
                  fill='#00c428'
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none bg-white rounded-full transition-all duration-200 ease-in-out'
                />
              </div>
              {isFavorite ? (
                <FaHeart
                  size={64}
                  cursor="pointer"
                  color='#FB6767'
                  onClick={() => handleFavorite("unlike")}
                  className='p-1.5'
                />
              ) : (
                <FaRegHeart
                  size={64}
                  cursor="pointer"
                  color='var(--color-primary)'
                  onClick={() => handleFavorite("like")}
                  className='p-1.5'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookView