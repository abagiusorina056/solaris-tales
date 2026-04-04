import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { 
    averageReview, 
    cn, 
    truncateText 
} from '@src/lib/utils'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import StarReviewComponent from '@src/app/(site)/carte/[id]/StarReviewComponent'
import { useRouter } from 'next/navigation'
import { bagItem, changeFavorite } from '@src/lib/user'
import { BsBagPlusFill } from 'react-icons/bs'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'

const LayoutTwo = ({ 
    book, 
    userId, 
    favorite, 
    reviews
}) => {
    const router = useRouter()
    const addedRef = useRef(null);
    const bookDiscount = parseFloat(book?.discount || "0")
    const bookPrice = parseFloat(book?.price)
    const [isFavorite, setIsFavorite] = useState(favorite)
    const averageOfReviews = reviews?.length === 0 ? 0 : averageReview(reviews)

    const handleFavorite = (action) => {
        setIsFavorite(action === "like" ? true : false)
        changeFavorite(book._id, userId, action)
    }

    const handleAddBagItem = () => {
        bagItem(book._id, userId, "add")

        addedRef.current.classList.add("zoom-in");

        setTimeout(() => {
            if (addedRef.current) addedRef.current.classList.remove("zoom-in");
        }, 500);
    }

  return (
    <div className='flex flex-col items-center relative justify-between text-black uppercase font-extrabold mt-10 shadow-md'>
        <Image
            src={book?.image}
            width={300}
            height={300}
            onClick={() => router.push(`/carte/${book._id}`)}
            className='!w-2/3 aspect-[1/1.5] object-cover object-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105'
            alt={book?.title}
        />
        <div className='flex flex-col items-center select-none'>
            <span
                onClick={() => router.push(`/carte/${book._id}`)}
                className='text-xl text-center mt-6'
            >
                {truncateText(book.title, 20)}
            </span>
            <span className='font-light'>{book.author}</span>
        </div>  

        <div className='flex items-center mt-3 gap-1 text-yellow-400'>
            <StarReviewComponent
                review={averageOfReviews}
                size={36}
            />
        </div>
        <div className='flex items-baseline-last justify-between w-full px-10 mt-3'>
            <div className='flex flex-col'>
                {bookDiscount > 0 && <span className='text-gray-300 line-through text-xl'>{bookPrice.toFixed(2)} RON</span>}
                <span className={cn('text-3xl font-bold', book?.discount && 'text-[#fb6767]')}>
                    {bookDiscount > 0 ? (((100 - bookDiscount) * bookPrice) / 100).toFixed(2) : bookPrice.toFixed(2)} RON
                </span>
            </div>
            <div className='relative'>
                <BsBagPlusFill
                    size={48}
                    onClick={handleAddBagItem}
                    cursor="pointer"
                    className="bg-[var(--color-primary)] rounded-sm text-white p-1.5"
                />
                <IoCheckmarkCircleSharp
                    ref={addedRef}
                    size={24}
                    fill='#00c428'
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none bg-white rounded-full transition-all duration-200 ease-in-out'
                />
            </div>
        </div>

        {bookDiscount > 0 && (
            <span className='absolute top-4 -left-4 text-white font-bold text-2xl bg-[#FB6767] px-6 select-none rounded-r-sm'>
                -{bookDiscount}%
            </span>
        )}
        {isFavorite ? (
            <FaHeart
                size={36}
                cursor="pointer"
                color='#FB6767'
                onClick={() => handleFavorite("unlike")}
                className='absolute -top-2 -right-2'
            />
        ) : (
            <div>
                <FaRegHeart
                    size={36}
                    cursor="pointer"
                    color='#B2B2B2'
                    onClick={() => handleFavorite("like")}
                    className='absolute -top-2 -right-2 z-10'
                />
                <FaHeart
                    size={36}
                    cursor="pointer"
                    color='#f7f7f7'
                    className='absolute -top-2 -right-2 z-0 pointer-events-none'
                />
            </div>
        )}
    </div>
  )
}

export default LayoutTwo