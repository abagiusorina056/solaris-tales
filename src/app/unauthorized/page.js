import Image from 'next/image'
import React from 'react'
import logo from "@public/logo.png"
import Link from 'next/link'
import { IconCancel } from '@tabler/icons-react'

const Unauthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-2 bg-[#F0DECA] h-[100vh] relative'>
      <Image 
        src={logo}
        className='w-40 absolute top-4 left-4'
        alt=''
      />
      
      <div className='flex items-end gap-8'>
        <div className='relative'>
          <IconCancel size={300} className='text-[var(--color-primary)]' />
          <IconCancel size={300} className='absolute text-[var(--color-primary)]/30 -bottom-3 -right-3' />
        </div>
        <div className='flex-col -gap-5'>
          <p className='text-white font-extrabold text-[100px] leading-none'>Ne-</p>
          <p className='text-white font-extrabold text-[100px] leading-none'>Autorizat</p>
        </div>
      </div>
      
      <div className='flex absolute bottom-1/6 items-baseline gap-1 text-[var(--color-primary)] font-semibold text-xl'>
        <span>Nu ai acces la aceasta pagina.</span>
        <span>Intoarce-te la</span>
        <Link href={"/"}>
          <span className='hover:underline font-extrabold'>Pagina Principala</span>
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized