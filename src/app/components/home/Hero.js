import React from 'react'
import Image from 'next/image'
import heroBg from "@public/home-hero-bg.png"

const Hero = () => {
  return (
    <section className='w-full relative'>
        <Image
            src={heroBg}
            className='w-full object-center'
            alt='Solaris Tales'
        />
        <div className='absolute top-1/2 bottom-1/2 translate-y-1/2 left-24 text-white uppercase'>
            <h1 className='tracking-widest text-4xl'>Solaris Tales</h1>
            <p className='text-2xl font-extrabold mt-7'>Because every story deserves</p>
            <p className='text-2xl font-extrabold'>its sunrise</p>
        </div>
    </section>
  )
}

export default Hero