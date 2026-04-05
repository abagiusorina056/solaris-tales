"use client"

import defaultProfilPic from "@public/default-profile-pic.png";
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Textarea } from "@src/components/ui/textarea"
import { 
  IconX, IconSignature, IconPhone, 
  IconMars, IconVenus, IconCake, 
  IconBrandInstagram, IconBrandFacebook, IconBlockquote, 
  IconPencil, IconTrash, IconExternalLink, IconClipboard, 
  IconCheck, IconPencilCancel, IconLoader2,
} from "@tabler/icons-react"
import { BsEnvelope } from "react-icons/bs"
import Image from "next/image"
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@src/components/ui/dialog"
import { FaInstagram } from "react-icons/fa"
import { LuFacebook } from "react-icons/lu"
import { deleteUser, removeImage, updateUser } from "@src/lib/admin"
import { toast } from "sonner"
import { socket } from "@src/lib/socketClient";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@src/components/ui/input-group";

const UserAuthorCard = ({ user, slug, reload }) => {
  const defaultValues = {
    instagram: user?.instagram,
    facebook: user?.facebook,
    bio: user?.bio
  }

  const [copied, setCopied] = useState(false)
  const [formValues, setFormValues] = useState(defaultValues)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false)
  const [image, setImage] = useState(user?.profileImage || user?.image)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageRemoval = () => {
    setIsRemoving(true)
    removeImage(
      user?._id, 
      user?.profileImage || user?.image, 
      user?.slug?.length > 0
    )
  }

  const handleSubmit = async () => {
    setIsUpdating(true)

    await updateUser(user._id, formValues, user?.slug > 0)
    toast.success("Utilizator actualizat cu succes")
    setIsUpdating(false)
    setEditDialog(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    await deleteUser(user._id)
    toast.success("Utilizator sters cu succes")
    setIsDeleting(false)
    setDeleteDialog(false)
  }

  useEffect(() => {
    socket.on("userUpdatedAdmin", () => {
      reload()
    })
    
    socket.on("imageRemoved", () => {
      setIsRemoving(false)
      setImage(defaultProfilPic)
    })
    
    return () => {
      socket.off("userUpdatedAdmin")
      socket.off("imageRemoved")
    }
  }, [reload])

  useEffect(() => {
    setImage(user?.profileImage || user?.image)

    setFormValues({
      instagram: user?.instagram,
    facebook: user?.facebook,
    bio: user?.bio
    })
  }, [user])

  return (
    <div className='flex items-start gap-8'>
      <div className='flex flex-1/4! flex-col items-center gap-4 relative'>
        <div className="relative">
          <Image
            src={image || defaultProfilPic}
            width={300}
            height={300}
            alt={user?.firstName + " " + user?.lastName || user?.name || ""}
            className='w-75 aspect-square drop-shadow-2xl rounded-full'
          />
          {isRemoving ? (
            <IconLoader2 
              size={42} 
              className='rotate absolute text-white bg-black hover:bg-black/60 transition-all p-1 rounded-full top-0 right-0' 
            />
          ) : (
            <IconX 
              size={42} 
              onClick={handleImageRemoval}
              className='absolute text-white bg-black hover:bg-black/60 transition-all p-1 rounded-full top-0 right-0' 
              cursor="pointer"
            />
          )}
        </div>
        {slug && (
          <div className="relative">
            <span className="bg-gray-200 text-gray-500 text-xl w-fit rounded-sm px-2 py-1">
              {slug}
            </span>
            {copied ? (
              <IconCheck  
                size={24}
                className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400"
              />
            ) : (
              <IconClipboard 
                size={24} 
                cursor="pointer"
                className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => 
                  navigator.clipboard.writeText(slug)
                  .then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 5000)
                  })
                }
              />
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col flex-3/4'>
        <div className='flex w-full gap-2'>
          <div className='flex flex-col flex-1/2 gap-8'>
            <div className='flex gap-2 !text-2xl'>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconSignature size={24} />
                  <span>Prenume</span>
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="firstName"
                  id="firstName-preivew"
                  value={user?.firstName || user?.name?.split(" ")[0]}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconSignature size={24} />
                  <span>Nume</span>
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="lastName"
                  id="lastName-preview"
                  value={user?.lastName || user?.name?.split(" ")[1]}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
            </div>
            <div className='flex gap-2 !text-2xl'>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <BsEnvelope size={24} />
                  <span>Email</span>
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="email"
                  id="email-preview"
                  value={user?.email || "-"}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconPhone size={24} />
                  <span>Telefon</span>
                </div>
                <InputGroup className="bg-transparent placeholder:select-none">
                  <InputGroupAddon align="inline-start" className={"pr-2 border-gray-400"}>
                    <span className='text-xl'>+40</span>
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder="Telefon"
                    type="number"
                    name="phone"
                    id="phone"
                    value={
                      user?.phoneNumber 
                        ? ((user?.phoneNumber || "")[0] === "0"
                          ? "+4" +  user?.phoneNumber
                          : "+40" + user?.phoneNumber)
                        : "-"
                    }
                    onChange={handleChange}
                    className="!text-xl"
                  />
                </InputGroup>
              </div>
            </div>
            <div className='flex gap-2 !text-2xl'>
              <div className="flex-1/2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className='flex'>
                      <IconMars size={24} />
                      <IconVenus size={24} className='-ml-2' />
                    </div>
                    <span>Gen</span>
                  </div>
                  {!user?.gender && <IconPencilCancel size={20} className="opacity-40" />}
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="gender"
                  id="gender-preview"
                  value={!user?.gender ? "-" : (user?.gender === "male" ? "Barbat" : "Femeie")}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconCake size={24} />
                  <span>Data nasterii</span>
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="dob"
                  id="dob-preview"
                  value={
                    user?.dob 
                    ? format(user?.dob, "PPP", { locale: ro }) 
                    : "--/--/----"
                  }
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-1/2 gap-8'>
            <div className='flex gap-2 !text-2xl'>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconBrandInstagram size={24} />
                  <span>Instagram</span>
                  {user?.instagram && (
                    <Link href={`https://www.instagram.com/${user.instagram}`} target="_blank">
                      <IconExternalLink size={24} />
                    </Link>
                  )}
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="instagram"
                  id="instgram-preivew"
                  value={(user?.instagram && "@" + user?.instagram) || "-"}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
              <div className="flex-1/2">
                <div className="flex items-center gap-1">
                  <IconBrandFacebook size={24} />
                  <span>Facebook</span>
                  {user?.facebook && (
                    <Link href={`https://facebook.com/${user.facebook}`} target="_blank">
                      <IconExternalLink size={24} />
                    </Link>
                  )}
                </div>
                <Input
                  placeholder=""
                  type="text"
                  name="facebook"
                  id="facebook-preview"
                  value={user?.facebook || "-"}
                  readOnly
                  className="w-full !text-2xl"
                />
              </div>
            </div>
            <div className="flex-1/2 !text-2xl">
              <div className="flex items-center gap-1">
                <IconBlockquote size={24} />
                <span>Bio</span>
              </div>
              <Textarea
                placeholder=""
                name="bio"
                id="bio-preview"
                value={user?.bio || user?.description}
                className="w-full h-34! !text-xl"
              />
            </div>
          </div>
        </div>

        <div className='flex gap-4 w-full mt-8'>
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1/2 bg-black hover:bg-black text-white hover:text-white rounded-md cursor-pointer">
                <IconPencil size={48} />
                <span>Editeaza</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editeaza</DialogTitle>
              </DialogHeader>
              <DialogDescription className={"flex flex-col gap-4"}>
                <div className="flex items-center gap-3">
                  <FaInstagram size={28} />
                  <Input
                    placeholder=""
                    type="text"
                    name="instagram"
                    id="instagram-preview"
                    value={formValues.instagram || ""}
                    readOnly
                    className="w-full !text-2xl"
                  />
                  <Button 
                    variant={"ghost"}
                    disabled={!user?.instagram}
                    onClick={() => setFormValues(prev => ({ ...prev, instagram: "" }))}
                  >
                    Sterge
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <LuFacebook size={28} />
                  <Input
                    placeholder=""
                    type="text"
                    name="facebook"
                    id="facebook-preview"
                    value={formValues.facebook || ""}
                    readOnly
                    className="w-full !text-2xl"
                  />
                  <Button 
                    variant={"ghost"}
                    disabled={!user?.facebook}
                    onClick={() => setFormValues(prev => ({ ...prev, instagram: "" }))}
                  >
                    Sterge
                  </Button>
                </div>
                <div className="!text-2xl">
                  <div className="flex items-center gap-1 !text-2xl">
                    <IconBlockquote size={24} />
                    <span>Bio</span>
                    <Button 
                      variant={"ghost"} 
                      size="icon"
                      disabled={!user?.bio}
                      className="ml-auto"
                      onClick={() => setFormValues(prev => ({
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
                    value={formValues.bio || ""}
                    onChange={handleChange}
                    className="w-full h-34! !text-xl"
                  />
                </div>
              </DialogDescription>
              <DialogFooter>
                <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                  Anuleaza
                </DialogClose>
                <Button
                  disabled={isUpdating}
                  onClick={handleSubmit}
                  className="cursor-pointer text-white rounded-sm px-4 py-1 border-1"
                >
                  {isUpdating ? (
                    <IconLoader2 className="rotate" />
                  ) : (
                    <span>Trimite</span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1/2 text-red-500 bg-gray-200 hover:bg-gray-200 rounded-md cursor-pointer">
                <IconTrash size={48} />
                <span>Sterge</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
              <DialogHeader>
                <DialogTitle>Atentie</DialogTitle>
              </DialogHeader>
              <DialogDescription className={"flex flex-col gap-4"}>
                <span className='text-xl'>
                  Urmeaza sa stergi aceast {user?.firstName ? "utilizator" : "autor"}
                </span>
              </DialogDescription>
              <DialogFooter>
                <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                  Anuleaza
                </DialogClose>
                <Button
                  disabled={isUpdating}
                  onClick={handleDelete}
                  className="cursor-pointer text-white bg-red-500 hover:bg-red-500 rounded-sm px-4 py-1 border-1"
                >
                  {isDeleting ? (
                    <IconLoader2 className="rotate" />
                  ) : (
                    <span>Sterge</span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}



export default UserAuthorCard