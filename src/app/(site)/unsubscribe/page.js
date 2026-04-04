import React from 'react'
import logo from "@public/logo.png"
import Image from 'next/image'
import Link from 'next/link'

const Unsubscribe = () => {
  return (
    <div className='relative h-full w-full'>
      <div className='flex items-center absolute justify-between w-full top-0 px-8'>
        <Image 
          src={logo}
          className='w-40'
          alt=''
        />
        <span className='uppercase text-2xl'>Solaris Tales</span>
      </div>
      <div className='flex flex-col items-center justify-center  h-dvh text-3xl'>
        <p>Te-ai dezabonat cu succes</p>
        <p className='flex items-baseline gap-1'>
          <span>Intoarce-te la pagina</span>
          <Link href="/">
            <span className='text-[var(--color-primary)] font-semibold'>pagina principala</span>
          </Link>
        </p>
      </div>

    </div>
  )
}

export default Unsubscribe