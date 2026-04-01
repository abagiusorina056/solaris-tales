"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@src/components/ui/input';
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Button } from '@src/components/ui/button';
import { BsEnvelope } from 'react-icons/bs';
import { useUser } from '@src/hooks/useUser';

const Footer = () => {
    const { user } = useUser()

    const defaultValues = {
        email: user?.email || "",
        name: user?.firstName + " " + user?.lastName || ""
    }
    const [subscribeForm, setSubscribeForm] = useState(defaultValues)
    const [isSubscribing, setIsSubscribing] = useState(false)
    const [hideSubscricptionForm, setHideSubscriptionForm] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setSubscribeForm(pev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        setIsSubscribing(true)

        const isValid = true

        if (!isValid) {
            return
        }
    }
  return (
    <footer className='flex flex-col text-white pt-12 pb-6 bg-[var(--color-primary)]'>
        <div className='flex justify-between items-start  px-32'>
            <div className='flex flex-col gap-2 uppercase'>
                <h3 className='uppercase font-extrabold text-xl'>Informatii utile</h3>
                <Link href="/costuri-noi">Costuri de transport</Link>
                <Link href="/privacy-policy">Politica de Confidentialitate</Link>
                <Link href="/privacy-policy">Politica de retur</Link>
            </div>
            <div className='flex flex-col items-end'>
                <h3 className='uppercase font-extrabold text-xl'>Contact</h3>
                <span className='mt-3'>cevaemail@gmail.com</span>

                <h3 className='uppercase font-extrabold text-xl mt-4'>Follow Us</h3>
                <div className='flex items-center gap-5 mt-3'>
                    <Link href="">
                        <BsEnvelope size={28}/>
                    </Link>
                    <Link href="https://www.instagram.com">
                        <FaInstagram size={28}/>
                    </Link>
                    <Link href="https://facebook.com">
                        <FaFacebookF size={28}/>
                    </Link>
                </div>
            </div>
        </div>
        <div className='flex items-center gap-32 px-32'>
            <div>
                <h2 className='text-2xl uppercase font-extrabold'>Aboneaza-te la Newsletter</h2>
                <span className='text-xl uppercase font-light'>Si ai 10% reducere la prima comanda*</span>
                <p className='font-extrabold text-lg'>Primesti noutati direct in Inbox</p>
            </div>
            <div className='w-1/2'>
                <div className='flex items-center gap-10'>
                    <Input
                        placeholder="Adresa de email"
                        type="email"
                        name="email"
                        id="email"
                        value={subscribeForm.email}
                        onChange={handleChange}
                        autoComplete="off"
                        className="rounded-none border-0 border-b-1 border-whtie  ring-0 outline-0 bg-transparent text-white placeholder:text-gray-400 placeholder:select-none"
                    />
                    <Input
                        placeholder="Nume si prenume"
                        type="text"
                        name="name"
                        id="name"
                        value={subscribeForm.name}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full rounded-none border-0 border-b-1 border-white ring-0 outline-0 bg-transparent text-white placeholder:text-gray-400 placeholder:select-none"
                    />
                </div>
                <Button
                    disabled={isSubscribing}
                    variant="default"
                    className="bg-white hover:text-white cursor-pointer text-[var(--color-primary)] mt-5 rounded-none uppercase font-bold px-6 text-xl"
                >
                    Aboneaza-te
                </Button>
            </div>
        </div>
        <hr className='h-[3px] w-full my-6' />
        <div className='flex justify-between px-32 uppercase'>
            <Link href="/">ANPC</Link>
            <Link href="/">Carduri</Link>
        </div>
        <hr className='h-[3px] w-full my-6' />
        <Link href="/" className='w-full px-32 uppercase'>Inca cv ANPC</Link>
    </footer>
  )
}

export default  Footer
