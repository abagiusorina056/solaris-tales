import Image from 'next/image'
import React from 'react'
import { truncateText } from '@src/lib/utils';
import { Button } from '@src/components/ui/button'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegStar, FaStar } from 'react-icons/fa';

const LayoutOne = ({ book }) => {
  return (
    <div className='w-full h-9/10 flex flex-col items-center justify-between text-black uppercase font-extrabold mt-10'>
        <Image
            src={book.coverImage}
            alt={book.title}
            className='w-2/3 aspect-[3/4] object-cover object-center rounded-2xl border-5 border-solid border-white shadow-[0_0_20px_0_rgb(96,56,37)] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105'
        />
        <div className='flex flex-col items-center select-none' title={`${book.title} | ${book.author}`}>
            <span className='text-xl text-center mt-6'>{truncateText(book.title, 20)}</span>
            <span>{book.author}</span>
        </div>
        

        <div className='flex flex-col items-center mt-3'>
            <Button variant="outlined" className="border-1 border-black rounded-full py-2 px-4 cursor-pointer">
                <MdOutlineRemoveRedEye size={32} />
                <span className='uppercase font-extrabold'>Mai Multe</span>
            </Button>
            <div className='flex items-center mt-3 gap-1 text-yellow-400'>
                <FaStar size={24} />
                <FaStar size={24} />
                <FaStar size={24} />
                <FaStar size={24} />
                <FaRegStar size={24} />
            </div>
        </div>
    </div>
  )
}

export default LayoutOne