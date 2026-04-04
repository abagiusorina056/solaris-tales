"use client"

import defaultProfilPic from "@public/default-profile-pic.png";
import { format } from "date-fns"
import { ro } from "date-fns/locale"
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Textarea } from "@src/components/ui/textarea"
import { 
  IconX, IconSignature, IconPhone, 
  IconMars, IconVenus, IconCake, 
  IconBrandInstagram, IconBrandFacebook, IconBlockquote, 
  IconPencil, IconExternalLink,  IconPencilCancel, 
  IconLoader2, IconCalendarWeek, IconUpload,
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@src/components/ui/input-group";
import { removeImage, updateProfile, updateProfilImage } from "@src/lib/user";
import { validateUpdateProfileForm } from "@src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@src/components/ui/popover";
import { Calendar } from "@src/components/ui/calendar";
import { socket } from "@src/lib/socketClient";
import { useAdmin } from "@src/hooks/useAdmin";
import ImageDropzone from "@src/app/components/ImageDropzone";

const Profile = () => {
  const { data: user, invalidateAdmin } = useAdmin()

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber,
    dob: user?.dob,
    instagram: user?.instagram,
    facebook: user?.facebook,
    bio: user?.bio
  }
  
  const [formValues, setFormValues] = useState(defaultValues)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imageDialog, setImageDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false)

  const handleChangeProfilePic = async () => {
    setImageDialog(false);

    if (!file) return;
    await updateProfilImage(file, user?._id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageRemoval = () => {
    setIsRemoving(true)
    removeImage(user?.profileImage, user?._id)
  }

  const handleSubmit = async () => {
    setIsUpdating(true);
    const isValid = validateUpdateProfileForm(formValues)

    if (!isValid) {
      setIsUpdating(false);
      return;
    }

    updateProfile(user._id, formValues)
    .then(() => {
      setDialog(false)
      setIsUpdating(false)
    })
  }

  React.useEffect(() => {
    socket.on("userUpdated", () => {
      invalidateAdmin()
    })
    socket.on("imageUpdated", () => {
      invalidateAdmin()
    })
    
    socket.on("imageRemoved", () => {
      setIsRemoving(false)
      invalidateAdmin()
    })
    
    return () => {
      socket.off("userUpdated")
      socket.off("imageUpdated")
      socket.off("imageRemoved")
    }
  }, [invalidateAdmin])

  return (
    <div className='pt-16'>
      <div className='px-16'>
        <div className='flex items-start gap-8'>
          <div className='flex flex-1/4! flex-col items-center gap-4 relative'>
            <div className="relative">
              <div className="group cursor-pointer">
                <Image
                  src={user?.profileImage || defaultProfilPic}
                  width={300}
                  height={300}
                  alt={user?.firstName + " " + user?.lastName || user?.name || "User Avatar"}
                  className='w-75 aspect-square drop-shadow-2xl rounded-full'
                />
                <Dialog open={imageDialog} onOpenChange={setImageDialog}>
                  <DialogTrigger className="absolute curosr-pointer w-full h-full flex flex-col items-center justify-center bg-black/50 rounded-full top-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease">
                    <IconUpload size={64} className="text-white" />
                    <p className="text-white text-lg">Incarca o fotografie noua</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alege o noua poza de profil</DialogTitle>
                      <DialogDescription></DialogDescription>
                      <ImageDropzone
                        isNewProfilePic
                        isAdmin
                        onFileSelect={(f) => {
                          setFile(f);
                        }}
                        setProfilImage={handleChangeProfilePic}
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
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
                    <InputGroup className="py-0 bg-transparent placeholder:select-none">
                      <InputGroupAddon align="inline-start" className={"pr-2"}>
                        <span className='text-xl'>
                          {user?.phoneNumber ? "+40" : "-"}
                        </span>
                      </InputGroupAddon>
                      <InputGroupInput 
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber-preview"
                        value={user?.phoneNumber || "-"}
                        className="w-full !text-2xl"
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

            <Dialog open={dialog} onOpenChange={setDialog} >
              <DialogTrigger asChild>
                <Button className="w-1/2 mt-8 bg-black hover:bg-black text-white hover:text-white rounded-md cursor-pointer">
                  <IconPencil size={48} />
                  <span>Editeaza</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editeaza</DialogTitle>
                </DialogHeader>
                <DialogDescription className={"flex flex-col gap-4"}>
                  <Input
                    placeholder="Nume"
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    className="w-full !text-xl"
                  />
                  <Input
                    placeholder="Prenume"
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    className="w-full !text-xl"
                  />
                  {!user?.phoneNumber && (
                    <InputGroup className="py-0 bg-transparent placeholder:select-none">
                      <InputGroupAddon align="inline-start" className={"pr-2"}>
                        <Image
                          src={"/flag.jpeg"}
                          width={20}
                          height={20}
                          className="h-full w-auto rounded-sm"
                          alt='Romania'
                        />
                        <span className='text-xl opacity-80'>+40</span>
                      </InputGroupAddon>
                      <InputGroupInput 
                        placeholder="Telefon"
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formValues?.phoneNumber || ""}
                        onChange={handleChange}
                        className="w-full !text-xl"
                      />
                    </InputGroup>
                  )}
                  {!user?.dob && (
                    <Popover>
                      <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!formValues.dob}
                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-white !text-xl"
                          >
                            <IconCalendarWeek size={28} />
                            {formValues.dob ? format(formValues.dob, "PPP", { locale: ro }) : <span>Data nasterii</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align='start'>
                        <Calendar
                          mode="single"
                          name="dob"
                          id="dob"
                          selected={formValues.dob || ""}
                          onSelect={(date) => setFormValues(prev => ({
                            ...prev,
                            dob: date
                          }))}
                          locale={ro} 
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                  <div className="flex items-center gap-3">
                    <FaInstagram size={28} />
                    <Input
                      placeholder=""
                      type="text"
                      name="instagram"
                      id="instagram-preview"
                      value={formValues.instagram || ""}
                      onChange={handleChange}
                      className="w-full !text-2xl"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <LuFacebook size={28} />
                    <Input
                      placeholder=""
                      type="text"
                      name="facebook"
                      id="facebook-preview"
                      value={formValues.facebook || ""}
                      onChange={handleChange}
                      className="w-full !text-2xl"
                    />
                  </div>
                  <div className="!text-2xl">
                    <div className="flex items-center gap-1 !text-2xl">
                      <IconBlockquote size={24} />
                      <span>Bio</span>
                      <Button 
                        variant={"ghost"} 
                        size="icon"
                        disabled={!formValues.bio}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile