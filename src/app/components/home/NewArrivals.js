import React from 'react'
import LayoutOne from '../book-cards/LayoutOne'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel"
import book1 from '@public/mockup-books/lotr1.jpeg'
import book2 from '@public/mockup-books/lotr2.jpeg'
import book3 from '@public/mockup-books/lotr3.jpeg'
import book4 from '@public/mockup-books/lotr4.jpeg'
import book5 from '@public/mockup-books/hobbit1.jpeg'
import book6 from '@public/mockup-books/hobbit2.jpg'
import book7 from '@public/mockup-books/hobbit3.jpeg'
import book8 from '@public/mockup-books/hobbit4.webp'

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
const booksHobbit= [
    {
        title: "The Hobbit",
        author: "JRR Tolkien",
        reviews: 5,
        coverImage: book5
    },
    {
        title: "The Hobbit: The Desolation of Smaug",
        author: "JRR Tolkien",
        reviews: 5,
        coverImage: book6
    },
    {
        title: "The Hobbit: The Battle of the Five Armies",
        author: "JRR Tolkien",
        reviews: 5,
        coverImage: book7
    },
    {
        title: "The Hobbit: An Unexpected Journey",
        author: "JRR Tolkien",
        reviews: 5,
        coverImage: book8
    },
]

const NewArrivals = () => {
  return (
    <div className='my-10'>
        <h1 className='text-[var(--color-primary)] text-2xl font-extrabold uppercase'>Noi aparitii:</h1>

        <Carousel>
            <CarouselContent>
                <CarouselItem className='flex justify-around items-start'>
                    {booksLOTR.map((book, index) => (
                        <LayoutOne key={index} book={book} />
                    ))}
                </CarouselItem>
                <CarouselItem className='flex justify-around items-start'>
                    {booksHobbit.map((book, index) => (
                        <LayoutOne key={index} book={book} />
                    ))}
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-5 bg-[var(--color-primary)] text-white cursor-pointer !hover:bg-[var(--primary-color)] !hover:text-white" />
            <CarouselNext className="-right-5 bg-[var(--color-primary)] text-white cursor-pointer !hover:bg-[var(--primary-color)] !hover:text-white" />
        </Carousel>
    </div>
  )
}

export default NewArrivals