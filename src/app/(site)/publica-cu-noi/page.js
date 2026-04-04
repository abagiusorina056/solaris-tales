"use client"

import React, { useEffect, useState } from 'react'
import PageTitle from '@src/app/components/PageTitle'
import { Input } from '@src/components/ui/input'
import { Textarea } from '@src/components/ui/textarea'
import ImageDropzone from '@src/app/components/ImageDropzone'
import { Button } from '@src/components/ui/button'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@src/components/ui/dialog'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@src/components/ui/command"
import { useRouter } from 'next/navigation'
import { validatePublishForm } from '@src/lib/utils'
import { publishRequest } from '@src/lib/user'
import { Label } from '@src/components/ui/label'
import { Switch } from '@src/components/ui/switch'
import Link from 'next/link'
import { useUser } from '@src/hooks/useUser'
import { genres } from '@src/lib/genres'
import { Separator } from '@src/components/ui/separator'

const PublishView = () => {
  const { data: user } = useUser()

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber || "",
    email: user?.email,
    title: "",
    description: "",
    bookFragments: "",
    acceptTerms: false,
    acceptData: false,
    genre: ""
  }
  const [formData, setFormData] = useState(defaultValues)
  const [disabled, setDisabled] = useState(false)
  const [addDisabled, setAddDisabled] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCancelling = () => router.push("/")

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddDisabled(true)

    const isValid = validatePublishForm(formData)

    if (!isValid) {
      setAddDisabled(false)
      return
    }

    publishRequest(formData, user._id)
    .then(() => {
      setAddDisabled(false)
      router.push("/")
    })
  }

  useEffect(() => {
    setDisabled(Object.values(formData).every(value => value === ""))
  }, [formData])

  return (
    <div className="w-full">
      <PageTitle title="Publica cu noi"></PageTitle>
      <div className='px-16 py-16'>
        <form className='flex w-full items-baseline px-3 gap-2' onSubmit={handleSubmit}>
          <div className='flex flex-col flex-3/5 gap-2'>
            <h1 className='text-[var(--color-primary)] text-3xl font-bold'>Date despre autor</h1>
            <div className="flex gap-2">
              <Input
                placeholder="Nume"
                variant="default"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                disabled
                className="bg-white py-6 !text-xl"
              />
              <Input
                placeholder="Prenume"
                variant="default"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                disabled
                className="bg-white py-6 !text-xl"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Telefon"
                variant="default"
                type="text"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="bg-white py-6 !text-xl"
              />
              <Input
                placeholder="Telefon"
                variant="default"
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                disabled={user.phoneNumber?.length}
                onChange={handleChange}
                className="bg-white py-6 !text-xl"
              />
            </div>
            <Separator className={"my-3"} />
            <div className="flex flex-col gap-2">
              <h1 className='text-[var(--color-primary)] text-3xl font-bold'>Date despre carte</h1>
              <div className='flex gap-2'>
                <Input
                  placeholder="Titlu"
                  variant="default"
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-white py-6 !text-xl w-1/2"
                />
                <Input
                  placeholder="Gen"
                  variant="default"
                  type="text"
                  id="genre"
                  name="genre"
                  onClick={() => setOpen(true)}
                  value={formData.genre}
                  onChange={() => {}}
                  className="bg-white py-6 !text-xl w-1/2"
                />
              </div>
              <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                  <CommandInput placeholder="Cauta un gen literar..." />
                  <CommandList>
                    <CommandEmpty>Niciun gen gasit</CommandEmpty>
                    <CommandGroup >
                      {genres.genres.map((g) => (
                        <CommandItem 
                          key={g.id}
                          className={"px-0! py-0!"}
                          >
                          <span 
                            className='w-full px-2 py-1.5'
                            onClick={() => {
                              handleChange(
                                { target: { name: "genre", value: g.label } }
                              )
                              setOpen(false)
                            }}
                          >{g.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CommandDialog>
              <Textarea
                placeholder="Descriere carte / Rezumat"
                variant="default"
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-white py-2 !text-xl min-h-32 max-h-32"
              />
            </div>

            <Label
              htmlFor="accept-terms"
              className="flex mt-16 items-center justify-end w-fit gap-2 flex-1/2 cursor-pointer"
            >
              <Switch
                id="accept-terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({
                    ...prev,
                    acceptTerms: checked,
                  }))
                }
                className="scale-110 bg-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]"
              />
              <span className="flex gap-1 font-semibold text-xl text-[var(--color-primary)]">
                <span className='text-black'>Accept</span>
                <Link href="/" target='_blank'>Termenii si conditiile</Link>
              </span>
            </Label>
            <Label
              htmlFor="accept-data"
              className="flex items-center justify-end w-fit gap-2 flex-1/2 cursor-pointer"
            >
              <Switch
                id="accept-data"
                checked={formData.acceptData}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({
                    ...prev,
                    acceptData: checked,
                  }))
                }
                className="scale-110 bg-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]"
              />
              <span className="flex gap-1 font-semibold text-xl">Accept prelucrarea datelor cu caracter personal</span>
            </Label>
            <span className='text-xl'>Prin completarea acestui formular, îți exprimi acordul ca datele tale să fie prelucrate de SolarisTales S.R.L. în scopul evaluării manuscrisului și comunicării cu Editura, conform Politicii de confidențialitate și GDPR.</span>
            <div className='flex w-full items-center gap-3 mt-2'>
              <Button
                type="submit"
                disabled={addDisabled}
                variant="default"
                className="text-white bg-[var(--color-primary)] flex-1/3 drop-shadow-lg  mt-2 rounded-none uppercase font-bold px-6 text-xl cursor-pointer hover:bg-[var(--color-primary)]"
              >
                {addDisabled ? (
                  <AiOutlineLoading3Quarters className="rotate" />
                ) : (
                  <span>Trimite cererea</span>
                )}
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={disabled}
                onClick={() => setFormData(defaultValues)}
                className="bg-white text-[var(--color-primary)] flex-1/3 drop-shadow-lg mt-2 rounded-none font-bold px-6 text-xl cursor-pointer hover:bg-white"
              >
                Reseteaza
              </Button>
              <Dialog>
                <DialogTrigger className="flex-1/3 drop-shadow-lg bg-white text-red-400 w-full rounded-none font-bold px-6 py-1 mt-2 text-xl cursor-pointer hover:bg-white">
                  Renunta
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Esti sigur ca vrei sa renunti?</DialogTitle>
                    <DialogDescription className={"mt-4"}>
                      <Button
                        onClick={handleCancelling}
                        className="cursor-pointer bg-[var(--color-primary)] border-1"
                        title="Iesi din cont"
                      >
                        Confirma
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className='flex flex-col flex-2/5 gap-2'>
            <h1 className='text-[var(--color-primary)] text-3xl font-bold'>Fragmente din carte</h1>
            <ImageDropzone 
              isPdfOnly
              onFileSelect={(file) => setFormData(prev => ({
                ...prev,
                bookFragments: file
              }))}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublishView