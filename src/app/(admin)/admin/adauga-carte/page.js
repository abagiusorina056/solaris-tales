"use client"

import React, { useEffect, useState } from 'react'
import { format } from "date-fns"
import { ro } from "date-fns/locale";
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { Textarea } from "@src/components/ui/textarea"
import { Calendar } from "@src/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@src/components/ui/input-group"
import { 
  IconBlockquote, 
  IconLoader2, 
  IconSearch, 
  IconSignature, 
  IconX 
} from '@tabler/icons-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@src/components/ui/popover"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@src/components/ui/command"
import { Button } from '@src/components/ui/button'
import { FaRegCalendar } from "react-icons/fa6";
import ImageDropzone from '@src/app/components/ImageDropzone';
import { useRouter } from 'next/navigation'
import { validateAddBookForm, validateCreateAuthorForm } from '@src/lib/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IconPlus } from '@tabler/icons-react';
import { useAuthors } from '@src/hooks/useAuthors';
import Image from 'next/image';
import { addBook, createClassicAuthor } from '@src/lib/admin';
import { socket } from '@src/lib/socketClient';
import { genres } from '@src/lib/genres';

const AddBookView = ({ }) => {
  const {
    authors,
    search: searchAuthors,
    setSearch: setSearchAuthors,
  } = useAuthors({ limit: 3 })
  const defaultValues = {
    title: "",
    description: "",
    bookFragments: "",
    image: "",
    price: "",
    releaseDate: "",
    authorId: "",
    genre: ""
  }
  const defaultAuthorValues = {
    name: "",
    bio: ""
  }
  const [formData, setFormData] = useState(defaultValues)
  const [newAuthorFormData, setNewAuthorFormData] = useState(defaultAuthorValues)
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
  const [file, setFile] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null)
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

  const handleCreateAuthor = async () => {
    const isValid = validateCreateAuthorForm(
      file, setNewAuthorFormData.name, setNewAuthorFormData.bio
    )

    if (!isValid) {
      setAddDisabled(false)
      return
    }

    setIsCreatingAuthor(true)
    await createClassicAuthor({
      file,
      name: newAuthorFormData.name,
      bio: newAuthorFormData.bio,
      isClassicAuthor: true
    })
    .then(() => {
      setIsCreatingAuthor(false)
      setCreateDialog(false)
      setNewAuthorFormData(defaultAuthorValues)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddDisabled(true)

    const isValid = validateAddBookForm(formData)

    if (!isValid) {
      setAddDisabled(false)
      return
    }

    const targetGenre = genres.genres.find(g => g.label === formData.genre)

    addBook({
      title: formData.title,
      description: formData.description,
      image: formData.image,
      bookFragments: formData.bookFragments,
      price: parseFloat(formData.price).toFixed(2).toString(),
      releaseDate: formData.releaseDate,
      genre: targetGenre.slug
    }, selectedAuthor)
    .then(() => {
      setAddDisabled(false)
      router.push("/admin/carti")
    })
  }

  useEffect(() => {
    socket.on("newAuthorCreated", (newAuthor) => {
      setSelectedAuthor(newAuthor)
    })

    return () => {
      socket.off("newAuthorCreated")
    }
  }, [])

  useEffect(() => {
    setDisabled(Object.values(formData).every(value => value === ""))
  }, [formData])

  return (
    <div className='w-full pt-16'>
      <form className='flex px-16' onSubmit={handleSubmit}>
        <div className='flex flex-col justify-between flex-2/3 w-full pt-4 px-3'>
          <div className='flex w-full mb-4 gap-3'>
            <div className="flex-1/2">
              <Label
                htmlFor="title"
                className="font-semibold text-xl"
              >
                Titlu
              </Label>
              <Input
                variant="default"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-white py-6 !text-xl"
              />
            </div>
            <div className="flex-1/2">
              <Label
                htmlFor="author"
                className="font-semibold text-xl"
              >
                Autor
              </Label>
              <div className='flex items-center gap-2'>
                <div className='relative w-full'>
                  <InputGroup className="bg-white py-6 !text-xl w-full">
                    <InputGroupInput 
                      placeholder="Cauta..."
                      disabled={selectedAuthor !== null}
                      value={selectedAuthor 
                        ? selectedAuthor.name
                        : searchAuthors
                      }
                      onChange={e => setSearchAuthors(e.target.value)}
                      className={"!text-xl outline-none focus:ring-0"} 
                    />
                    {selectedAuthor === null && (
                      <InputGroupAddon>
                        <IconSearch size={24} />
                      </InputGroupAddon>
                    )}
                    {selectedAuthor && (
                      <InputGroupAddon align="inline-start">
                        <Image
                          src={selectedAuthor.image || "/placeholder-profile.png"}
                          alt={``}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      </InputGroupAddon>
                    )}
                    {selectedAuthor !== null && (
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => {
                          setSelectedAuthor(null)
                          setFormData(prev => ({
                            ...prev,
                            authorId: ""
                          }))
                          setSearchAuthors("")
                        }}
                      >
                        <IconX size={24} cursor={"pointer"} />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {(searchAuthors.length > 0 && authors.length > 0 && !selectedAuthor) && ((
                    <div className='absolute mt-1 rounded-sm py-1.5 px-1 flex flex-col gap-1 bg-gray-100 w-full z-30'>
                      {authors.map((a) => (
                        <div 
                          key={a.slug}
                          className='flex items-center rounded-md gap-2 px-2 py-1 hover:bg-gray-300 cursor-pointer'
                          onClick={() => {
                            setSelectedAuthor(a)
                            setFormData(prev => ({
                            ...prev,
                            authorId: a.id
                            }))
                          }}
                        >
                          <Image
                            src={a.image || "/placeholder-profile.png"}
                            alt={`${a.firstName} ${a.lastName}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className='flex flex-col'>
                            <span className='font-semibold'>{a.name}</span>
                            <span className='opacity-60 text-sm'>{a.slug}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      type="button"
                      disabled={selectedAuthor !== null}
                    >
                      <IconPlus size={32} />
                    </Button> 
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adauga un nou Autor</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className={"flex flex-col gap-4"}>
                      <ImageDropzone
                        isNewProfilePic
                        hideConfirmButton
                        onFileSelect={(f) => setFile(f)}
                      />
                      <div className="!text-2xl">
                        <Label className="flex items-center gap-1 !text-2xl">
                          <IconSignature size={24} />
                          <span>Nume</span>
                        </Label>
                        <Input
                          placeholder=""
                          type="text"
                          name="lastName"
                          id="lastName-preview"
                          value={newAuthorFormData.name}
                          onChange={e => setNewAuthorFormData(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          className="w-full !text-2xl"
                        />
                      </div>
                      <div className="!text-2xl">
                        <div className="flex items-center gap-1">
                          <Label className="flex items-center gap-1 !text-2xl">
                            <IconBlockquote size={24} />
                            <span>Bio</span>
                          </Label>
                          <Button 
                            variant={"ghost"} 
                            size="icon"
                            disabled={!newAuthorFormData.bio}
                            className="ml-auto"
                            onClick={() => setNewAuthorFormData(prev => ({
                              ...prev,
                              bio: "",
                            }))}
                          >
                            <IconX size={20} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder=""
                          name="bio"
                          id="bio-preview"
                          value={newAuthorFormData.bio}
                          onChange={e => setNewAuthorFormData(prev => ({
                            ...prev,
                            bio: e.target.value
                          }))}
                          className="w-full h-34! !text-xl"
                        />
                      </div>
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                        Anuleaza
                      </DialogClose>
                      <Button
                        disabled={isCreatingAuthor}
                        onClick={handleCreateAuthor}
                        className="cursor-pointer text-white rounded-sm px-4 py-1 border-1"
                      >
                        {isCreatingAuthor ? (
                          <IconLoader2 className="rotate" />
                        ) : (
                          <span>Creeaza</span>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className='flex w-full mb-4 gap-3'>
            <div className="flex-1/2">
              <Label
                htmlFor="description"
                className="font-semibold text-xl"
              >
                Descriere
              </Label>
              <Textarea
                variant="default"
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-white py-2 !text-xl min-h-32 max-h-32"
              />
            </div>
            <div className="flex-1/2">
              <Label
                htmlFor="bookFragments"
                className="font-semibold text-xl"
              >
                Fragmente din carte
              </Label>
              <Textarea
                variant="default"
                type="text"
                id="bookFragments"
                name="bookFragments"
                value={formData.bookFragments}
                onChange={handleChange}
                className="bg-white py-2 !text-xl min-h-32 max-h-32"
              />
            </div>
          </div>

          <div className='flex items-center w-full mb-4 gap-3'>
            <div className='flex-1/3'>
              <Label
                htmlFor="releaseDate"
                className="font-semibold text-xl"
              >
                Data publicarii
              </Label>
              <Popover id="releaseDate" name="releaseDate">
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!formData.date}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-white py-6 !text-xl"
                  >
                    <FaRegCalendar />
                    {formData.releaseDate ? format(formData.releaseDate, "PPP", { locale: ro }) : <span>Alege o data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align='start'>
                  <Calendar
                    mode="single"
                    selected={formData.releaseDate}
                    onSelect={(date) => setFormData(prev => ({
                      ...prev,
                      releaseDate: date
                    }))}
                    locale={ro} 
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1/3">
              <Label
                htmlFor="price"
                className="font-semibold text-xl"
              >
                Gen
              </Label>
              <Input
                variant="default"
                type="text"
                id="genre"
                name="genre"
                onClick={() => setOpen(true)}
                value={formData.genre}
                onChange={() => {}}
                className="bg-white py-6 !text-xl"
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
            <div className="flex-1/3">
              <Label
                htmlFor="price"
                className="font-semibold text-xl"
              >
                Pret
              </Label>
              <div className='flex items-center gap-2'>
                <Input
                  variant="default"
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-white py-6 !text-xl"
                />
                <span className='text-xl font-bold'>RON</span>
              </div>
            </div>
          </div>
          
          <div className='flex w-full items-center gap-3 mt-16'>
            <Button
              type="submit"
              disabled={addDisabled}
              variant="default"
              className="text-white flex-1/3 mt-2 uppercase font-bold px-6 text-xl cursor-pointer"
            >
              {addDisabled ? (
                <AiOutlineLoading3Quarters className="rotate" />
              ) : (
                <span>Adauga</span>
              )}
            </Button>
            <Button
              variant="default"
              disabled={disabled}
              onClick={() => {
                setSelectedAuthor(null)
                setFormData(defaultValues)
              }}
              className="text-gray-500 flex-1/3 mt-2 bg-gray-200 hover:bg-gray-200 font-bold px-6 text-xl cursor-pointer"
            >
              Reseteaza
            </Button>
            <Dialog>
              <DialogTrigger className="flex-1/3">
                <Button
                  variant="default"
                   className="text-red-500 w-full mt-2 bg-gray-200 hover:bg-gray-200 font-bold px-6 text-xl cursor-pointer"
                >
                  Renunta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Esti sigur ca vrei sa renunti?</DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    onClick={handleCancelling}
                    className="cursor-pointer text-white rounded-sm px-4 py-1 bg-[var(--color-primary)] border-1"
                  > 
                    Confirma
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col flex-1/3 mt-4 h-full">
          <Label
            className="font-semibold text-xl"
          >
            <span>Imagine de coperta</span>
          </Label>
          <ImageDropzone onFileSelect={(file) => setFormData(prev => ({
            ...prev,
            image: file
          }))} />
        </div>
      </form>
    </div>
  )
}

export default AddBookView