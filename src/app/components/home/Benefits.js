import { IconStar } from '@tabler/icons-react';
import React from 'react'
import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { PiShootingStar } from "react-icons/pi";

const Benefits = () => {
  return (
    <section className='flex items-center justify-around text-xl font-bold w-full py-8'>
        <div className='flex flex-col items-center text-center'>
            <CiDeliveryTruck size={64} className='text-[#8C8C8C]' />
            <span>Livrare gratuita </span>
            <span className='text-lg opacity-50 font-medium'>oriunde in tara </span>
        </div>
        <div className='flex flex-col items-center text-center'>
            <CiGift size={64} className='text-[#8C8C8C]' />
            <span>Surpriza </span>
            <span className='text-lg opacity-50 font-medium'>la fiecare comanda </span>
        </div>
        <div className='flex flex-col items-center text-center'>
            <IconStar size={64} className='text-[#8C8C8C] border-5 border-#8C8C8C] p-1.5 rounded-full' />
            <span>Puncte de fidelitate </span>
            <span className='text-lg opacity-50 font-medium'>pentru fiecare achizitie </span>
        </div>
    </section>
  )
}

export default Benefits