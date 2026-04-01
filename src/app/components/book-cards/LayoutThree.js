import React from 'react'

import lotr from '@public/mockup-books/lotr1.jpeg'
import Image from 'next/image'
import { FaHeartBroken } from "react-icons/fa";
import { Button } from '@src/components/ui/button';
import { truncateText } from '@src/lib/utils';
import Link from 'next/link';
import { LuHeartOff } from 'react-icons/lu';
import { IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { bagItem, changeFavorite } from '@src/lib/user';


const LayoutThree = ({ book, isOwnedBook, userId }) => {
    const [isRemovingFav, setIsRemovingFav] = React.useState(false)
    const [isAddingToBag, setIsAddingToBag] = React.useState(false)

    const handleChangeFavorite = () => {
        setIsRemovingFav(true)

        changeFavorite(book._id, userId, "unlike")
            .then(() => {
                toast.success("Cartea a fost eliminata de la Favorite")
                setIsRemovingFav(false)
            })
    }

    const handleAddToBag = () => {
		setIsAddingToBag(true)

		bagItem(book._id, userId, "add")
			.then(() => {
				toast.success("Cartea a fost adaugata in cos")
				setIsAddingToBag(false)
			})
	}

  return (
    <div className='flex items-center rounded-xl px-6 py-8 shadow-xl'>
        <Image
            src={book?.image || lotr}
            width={300}
            height={300}
            className='w-1/4 aspect-[1/1.5]! rounded-sm shadow-xl mr-2'
            alt={book?.title}
        />
        <div className='px-4 w-2/3'>
            <h1 className='text-2xl font-extrabold cursor-default'>
                <Link href={`/carte/${book?._id}`} className='hover:underline!'>
                    {book?.title}
                </Link>
            </h1>
            <span className='text-2xl font-semibold opacity-40'>
                <Link href={`/autor/${book?.authorId}`}>
                    {book?.author}
                </Link>
            </span>
            <p className='font-medium text-sm mt-6'>{truncateText(book?.description, 200)}</p>

            <div className='flex items-center justify-between mt-3'>
                <span className='text-2xl text-[#AD9C93]'>{book?.price} RON </span>
                {!isOwnedBook && (
                    <div className='flex items-center gap-5'>
                        {isRemovingFav ? (
                            <IconLoader2 className="rotate" />
                        ) : (
                            <LuHeartOff 
                                size={24} 
                                cursor="pointer" 
                                onClick={handleChangeFavorite}
                                className='text-gray-400 hover:text-gray-700' 
                            />
                        )}
                        <Button
                            variant="default"
                            type="button"
                            onClick={handleAddToBag}
                            disabled={isAddingToBag}
                            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] rounded-none text-xl !py-5 cursor-pointer transition-all"
                        >
                            {isAddingToBag ? (
                                <IconLoader2 className="rotate" />
                            ) : (
                                "Adauga in Cos"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default LayoutThree