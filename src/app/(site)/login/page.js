"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import loginImg from '@public/login-img.png'
import Link from 'next/link'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { Checkbox } from "@src/components/ui/checkbox"
import { Button } from '@src/components/ui/button'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { validateLoginForm } from '@src/lib/utils'
import { login } from '@src/lib/auth'

const Login = () => {
    const defaultValues = {
        email: "",
        password: "",
        rememberMe: false
    }
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState(defaultValues)
    const [disabled, setDisabled] = useState(false)

    const handleChange = (e) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

    const handleSubmit = (e) => {
        e.preventDefault();
		e.stopPropagation();
        setDisabled(true);

        const isValid = validateLoginForm(formData)
        if (!isValid) {
            setDisabled(false)
            return
        }

        login({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
        })
        .then(() => setDisabled(false))
    }

  return (
    <div className='w-full h-full flex items-center overflwo-hidden relative'>
        <div className='flex-3/5 flex flex-col items-center justify-center bg-[#F4FFF8] h-[100vh]'>
            <div className='tracking-widest font-thing uppercase w-full text-center mb-20 '>
                <h1 className='text-[var(--color-primary)] text-5xl'>Autentificare</h1>
                <h2 className='text-[#5E986B]/80 text-3xl'>Bine ai venit!</h2>
            </div>
            <form className='w-3/5' onSubmit={handleSubmit}>
                <div className=' mb-7'>
                    <Label htmlFor="email" className="font-semibold text-[#5E986B] text-xl">Email</Label>
                    <Input
                        variant='default'
                        type='email'
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e)}
                        placeholder='email@example.com'
                        className='bg-white py-6 !text-xl'
                    />
                </div>
                <div className='relative mb-7'>
                    <Label htmlFor="password" className="font-semibold text-[#5E986B] text-xl">Parola</Label>
                    <Input
                        variant='default'
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder='********'
                        value={formData.password}
                        onChange={(e) => handleChange(e)}
                        className='bg-white py-6 !text-xl'
                    />
                    {!passwordVisible ? (
                        <LuEye
                            size={28}
                            className='absolute right-4 top-1/2 text-[#5E986B] cursor-pointer'
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        />
                    ) : (
                        <LuEyeOff
                            size={28}
                            className='absolute right-4 top-1/2 text-[#5E986B] cursor-pointer'
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        />
                    )}
                </div>
                <div className='flex items-center justify-between text-[#5E986B] mb-4 mt-5'>
                    <div className='flex items-center gap-3 w-fit'>
                        <Checkbox
                            id="remember-me"
                            checked={formData.rememberMe}
                            onCheckedChange={(checked) => (
                                setFormData((prev) => ({
                                    ...[prev],
                                    rememberMe: checked
                                }))
                            )}
                            className='border-[#5E986B] data-[state=checked]:border-[#5E986B] data-[state=unchecked]:border-2 border-2 data-[state=checked]:bg-[#5E986B]'
                        />
                        <Label htmlFor="remember-me" className="not-required font-semibold text-xl">Tine-ma minte</Label>
                    </div>
                    <Link href="/" className='text-[#5E986B] text-xl'>Ai uitat parola?</Link>
                </div>

                <Button
                    type="submit"
                    disabled={disabled}
                    className='w-full bg-[var(--color-primary)] text-white text-2xl py-6 rounded-sm hover:bg-[(var(--color-primary)] cursor-pointer'
                >
                    {disabled ? (
                        <AiOutlineLoading3Quarters className="rotate" />
                    ) : (
                        <span>
                            Autentificare
                        </span>
                    )}
                </Button>
            </form>
            <div className='text-[#5E986B] text-xl text-center mt-5'>
                <span className='mr-1'>Esti nou pe aici?</span>
                <Link href="/sign-up">
                    <span className="underline">
                        Inregistreaza-te
                    </span>
                </Link>
            </div>

        </div>
        <Image
            src={loginImg}
            className='w-full h-[100vh] object-cover object-center'
            alt='Solaris Tales'
        />
        <Link href="/">
            <span className='absolute top-10 right-10 tracking-widest text-4xl text-white uppercase'>
               Solaris Tales
            </span>
        </Link>
    </div>
  )
}

export default Login