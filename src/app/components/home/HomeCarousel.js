import Image from 'next/image'
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@src/components/ui/carousel"
import { Button } from '@src/components/ui/button'
import carouselBg from '@public/home-carousel-bg.png'
import book1 from '@public/mockup-books/lotr1.jpeg'
import book2 from '@public/mockup-books/lotr2.jpeg'
import book3 from '@public/mockup-books/lotr3.jpeg'
import book4 from '@public/mockup-books/lotr4.jpeg'

const HomeCarousel = () => {
    const booksLOTR = [
        {
            title: "Lord of the Rings: The Fellowship of the Ring",
            author: "JRR Tolkien",
            reviews: 5,
            coverImage: book1
        },
        {
            title: "Lord of the Rings: The Two Towers",
            author: "JRR Tolkien",
            reviews: 5,
            coverImage: book2
        },
        {
            title: "Lord of the Rings: The Return of the King",
            author: "JRR Tolkien",
            reviews: 5,
            coverImage: book3
        },
        {
            title: "Lord of the Rings: The Fellowship of the Ring",
            author: "JRR Tolkien",
            reviews: 5,
            coverImage: book4
        },
    ]

  return (
    <div className='relative overflow-hidden text-white'>
        <Image
            src={carouselBg}
            className='absolute w-full h-full blur-xs'
            alt={"Solaris Tales"}
        />

        <Carousel>
            <CarouselContent>
                {booksLOTR.map((book, index) => (
                    <CarouselItem key={index} className='flex items-baseline-last w-full z-20 p-10 px-40'>
                        <Image
                            src={book.coverImage}
                            className='flex-1/5 border-2 border-white mr-6'
                            alt={book.title}
                        />
                        <div className='flex-3/4 justify-between'>
                            <div className='flex items-start justify-between'>
                                <div className='mb-16'>
                                    <h1 className='max-w-3/4 font-thin text-5xl uppercase bg-[var(--color-primary)] text-white px-4 py-1'>{book.title}</h1>
                                    <h2 className='text-4xl text-[var(--color-primary)] bg-white w-fit px-4'>{book.author}</h2>
                                </div>
                                <Button
                                    variant="default"
                                    className="rounded-none font-bold bg-[#d9d9d9] text-3xl px-12 py-8 text-black uppercase hover:text-white cursor-pointer"
                                >
                                    Detalii
                                </Button>
                            </div>
                            <p className='text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, quae necessitatibus adipisci nesciunt reprehenderit nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, quae necessitatibus adipisci nesciunt reprehenderit nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, quae necessitatibus adipisci nesciunt reprehenderit nemo.</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-10 bg-[var(--color-primary)] text-white cursor-pointer !hover:bg-[var(--primary-color)] !hover:text-white" />
            <CarouselNext className="right-10 bg-[var(--color-primary)] text-white cursor-pointer !hover:bg-[var(--primary-color)] !hover:text-white" />
        </Carousel>
    </div>
  )
}

export default HomeCarousel