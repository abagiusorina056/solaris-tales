import Image from 'next/image'
import React from 'react'
import logo from "@public/logo.png"
import Link from 'next/link'

const PageNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-2 bg-[#F0DECA] h-[100vh]'>
      <Image 
        src={logo}
        className='w-40 absolute top-4 left-4'
        alt=''
      />
      
      <div className='relative'>
        <h1 className='z-1 text-[300px] text-[var(--color-primary)] font-extrabold opacity-70'>404</h1>
        <span className='text-white font-bold text-[125px] z-0 absolute -top-1 left-1/2 whitespace-nowrap -translate-x-1/2'>Not Found</span>
      </div>
      
      <div className='flex items-baseline gap-1 text-[var(--color-primary)] font-semibold text-xl'>
        <span>Documentul cautat nu a fost gasit.</span>
        <span>Intoarce-te la</span>
        <Link href={"/"}>
          <span className='hover:underline font-extrabold'>Pagina Principala</span>
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound