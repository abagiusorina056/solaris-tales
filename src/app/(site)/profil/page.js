"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@src/app/components/PageTitle";
import defaultProfilPic from "@public/default-profile-pic.png";
import Image from "next/image";
import { LiaEdit } from "react-icons/lia";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdEdit, MdLogout } from "react-icons/md";
import LayoutThree from "@src/app/components/book-cards/LayoutThree";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { logout } from "@src/lib/auth";
import ImageDropzone from "@src/app/components/ImageDropzone";
import { removeImage, updateProfile, updateProfilImage } from "@src/lib/user";
import { useRouter } from "next/navigation";
import { Input } from "@src/components/ui/input";
import { FaInstagram, FaPhoneAlt, FaRegCalendar, FaSearch } from "react-icons/fa";
import { LuFacebook } from "react-icons/lu";
import { BsEnvelope } from "react-icons/bs";
import { CgFormatLeft } from "react-icons/cg";
import { Textarea } from "@src/components/ui/textarea";
import { Label } from "@src/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@src/components/ui/popover";
import { Calendar } from "@src/components/ui/calendar";
import { ro } from "date-fns/locale";
import { format } from "date-fns";
import { cn, orderStatusMap, truncateText, validateUpdateProfileForm } from "@src/lib/utils";
import { socket } from "@src/lib/socketClient";
import { useUser } from "@src/hooks/useUser";
import { IconHeartX, IconLoader2, IconRotate, IconStar, IconTruckDelivery, IconUpload, IconX } from "@tabler/icons-react";
import { Separator } from "@src/components/ui/separator";
import Link from "next/link";
import ProfileSkeleton from "@src/components/skeletons/site/ProfileSkeleton";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@src/components/ui/input-group";
import { useQueryClient } from "@tanstack/react-query";

const UserView = () => {
  const { data: user, invalidateUser } = useUser()
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isDisabled, setIsDisabled] = useState(false);
  const [searchedMyBooks, setSearchedMyBooks] = useState(user?.authoredBooks);
  const [searchedMyFavs, setSearchedMyFavs] = useState(user?.favoriteBooks);
  const [myBooksSearchTerm, setMyBooksSearchTerm] = useState("");
  const [myFavsSearchTerm, setMyFavsSearchTerm] = useState("");

  const search = (targetBooks, searchTerm) => {
    if (!targetBooks) return [];
    return targetBooks.filter((book) => {
      const title = book?.title?.toLowerCase() || "";
      const author = book?.author?.toLowerCase() || "";
      return title.includes(searchTerm.toLowerCase()) || author.includes(searchTerm.toLowerCase());
    });
  };

  const handleLogout = () => {
    setIsDisabled(true);
    logout()
      .then(() => {
        queryClient.clear();
        router.push("/login")
      });
  };

  useEffect(() => {
    socket.on("userUpdated", (updatedUser) => {
      invalidateUser()
    })

    socket.on("order-placed", () => {
      invalidateUser()
    })

    socket.on("imageUpdated", () => {
      invalidateUser()
    })

    socket.on("imageRemoved", () => {
      invalidateUser()
    })

    return () => {
      socket.off("userUpdated")
      socket.off("order-placed")
      socket.off("imageUpdated")
      socket.off("imageRemoved")
    }
  }, [invalidateUser])

  useEffect(() => {
    const filtered = search(user?.favoriteBooks, myFavsSearchTerm);
    setSearchedMyFavs(filtered);
  }, [myFavsSearchTerm, user?.favoriteBooks]);

  useEffect(() => {
    const filtered = search(user?.authoredBooks, myBooksSearchTerm);
    setSearchedMyBooks(filtered);
  }, [myBooksSearchTerm, user?.authoredBooks]);

  const chunkArray = (arr, size) => {
    if (!arr) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const chunkedFavs = chunkArray(searchedMyFavs, 2);
  const chunkedBooks = chunkArray(searchedMyBooks, 2);

  return !user._id ? (
    <ProfileSkeleton />
  ) : (
    <div className="w-full">
      <PageTitle title="Contul meu">
        <Dialog>
          <DialogTrigger className="cursor-pointer text-primary bg-white! border-1 px-3 py-0.5 rounded-sm border-none">
            <MdLogout className="w-8! h-8!" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Esti sigur?</DialogTitle>
              <DialogDescription>
                <span className="block mb-8">
                  Urmeaza sa te deloghezi
                </span>
                <Button
                  disabled={isDisabled}
                  onClick={handleLogout}
                  className="cursor-pointer bg-[var(--color-primary)] border-1"
                  title="Iesi din cont"
                >
                  {isDisabled ? (
                    <AiOutlineLoading3Quarters className="rotate" />
                  ) : (
                    <span>Confirma</span>
                  )}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageTitle>
      <div className="w-full px-16 mt-4">
        <UserCard user={user} />
      </div>
      
      <Separator className="my-8" />

      <div className="px-16">
        <h1 className="uppercase text-3xl font-extrabold text-[var(--color-primary)]">
          Istoric comenzi
        </h1>
        {user?.allOrders.length > 0 ? (
          <Table className="mb-4">
            <TableHeader>
              <TableRow className="text-xl font-medium">
                <TableHead>#</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Metoda de plata</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {user.allOrders.map((order) => (
                  <TableRow 
                    key={order.slug}
                    className="hover:bg-gray-200 cursor-pointer"
                    onClick={() => router.push(`/comanda/${order._id}`)}
                  >
                    <TableCell className="font-medium">{order.slug}</TableCell>
                    <TableCell>{orderStatusMap[order.status]}</TableCell>
                    <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">{order.price} RON</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-8">
            <IconTruckDelivery size={150} />
            <div className="w-full py-4 text-center text-xl">
              <p>Nu ai facut nicio comanda</p>
              <Link href="/carti" className="text-[var(--color-primary)]! font-bold">Incepe acum {">"}</Link>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-8" />

      <div className="px-16" id="favorite">
        <div className="flex items-end justify-between">
          <h1 className="uppercase text-3xl font-extrabold text-[var(--color-primary)]">
            Favoritele mele
          </h1>
          <div className="flex items-center bg-white px-3 rounded-l-sm text-xl">
            <FaSearch size={24} className="text-[var(--color-primary)]" />
            <Input
              placeholder="Cauta..."
              type="text"
              name="search"
              id="search"
              value={myFavsSearchTerm}
              disabled={!user?.favoriteBooks?.length}
              onChange={(e) => setMyFavsSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full shadow-none !text-xl border-0 ring-0 outline-0 bg-transparent placeholder:text-[var(--color-primary)] placeholder:select-none"
            />
          </div>
        </div>
        {!user?.favoriteBooks?.length ? (
          <div className="flex flex-col items-center justify-center py-16 gap-8">
            <IconHeartX size={150} />
            <p className="text-2xl">Inca nu ai carti favorite</p>
          </div>
        ) : (
          <Carousel>
            <CarouselContent className="pb-10 px-4">
              {chunkedFavs.length ? (
                chunkedFavs.map((pair, i) => (
                  <CarouselItem key={i} className="grid grid-cols-2 gap-4 md:gap-16">
                    {pair.map((book) => (
                      <LayoutThree 
                        key={book._id} 
                        book={book}
                        userId={user._id}
                      />
                    ))}
                  </CarouselItem>
                ))
              ) : (
                <p>Niciun rezultat</p>
              )}
            </CarouselContent>
            
            <CarouselPrevious className="-left-5 bg-[var(--color-primary)] text-white" />
            <CarouselNext className="-right-5 bg-[var(--color-primary)] text-white" />
          </Carousel>
        )}
      </div>


      {user?.role === "author" && (
        <>
          <Separator className="my-8" />
          <div className="px-16">
            <div className="flex items-end justify-between">
              <h1 className="uppercase text-3xl font-extrabold text-[var(--color-primary)]">
                Cartile mele
              </h1>
              <div className="flex items-center bg-white px-3 rounded-l-sm text-xl">
                <FaSearch size={24} className="text-[var(--color-primary)]" />
                <Input
                  placeholder="Cauta..."
                  type="text"
                  name="search"
                  id="search"
                  value={myBooksSearchTerm}
                  onChange={(e) => setMyBooksSearchTerm(e.target.value)}
                  autoComplete="off"
                  className="w-full shadow-none !text-xl border-0 ring-0 outline-0 bg-transparent placeholder:text-[var(--color-primary)] placeholder:select-none"
                />
              </div>
            </div>
            {!user?.authoredBooks?.length ? (
              <span>Nu ai carti publicate</span>
            ) : (
              <Carousel>
                <CarouselContent className="pb-10 px-4">
                  {chunkedBooks.length ? (
                    chunkedBooks.map((pair, i) => (
                      <CarouselItem key={i} className="grid grid-cols-2 gap-4 md:gap-16">
                        {pair.map((book) => (
                          <LayoutThree 
                            key={book._id}
                            book={book}
                            isOwnedBook
                          />
                        ))}
                      </CarouselItem>
                    ))
                  ) : (
                    <p>Niciun rezultat</p>
                  )}
                </CarouselContent>
                
                <CarouselPrevious className="-left-5 bg-[var(--color-primary)] text-white" />
                <CarouselNext className="-right-5 bg-[var(--color-primary)] text-white" />
              </Carousel>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const UserCard = ({ user }) => {
  const defaults = {
    email: user?.email || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    bio: user?.bio || "",
    dob: user?.dob || "",
    phoneNumber: user?.phoneNumber || ""
  }
  const [formData, setFormData] = useState(defaults)
  const [imageDialog, setImageDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [file, setFile] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false)
  const [detailedBio, setDetailedBio] = useState(false)

  const handleChangeProfilePic = async () => {
    setImageDialog(false)

    if (!file) return;
    await updateProfilImage(file, user?._id);

    setImageDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleUpdateProfile = async () => {
    setIsDisabled(true);
    const isValid = validateUpdateProfileForm(formData)

    if (!isValid) {
      setIsDisabled(false);
      return;
    }

    setProfileDialog(false)
    updateProfile(user._id, formData)
      .then(() => setIsDisabled(false))
  }

  const handleImageRemoval = () => {
    setIsRemoving(true)
    removeImage(user?.profileImage, user?._id)
      .then(() => setIsRemoving(false))
  }

  return (
    <div className="flex items-start relative px-6 pt-10 gap-8 shadow-md border-2 border-solid border-[#E6E6E6]">
      <div className="flex flex-col flex-1/4 items-center relative">
        <div className="relative">
          <div className="group cursor-pointer">
            <Image
              src={user?.profileImage || defaultProfilPic}
              width={300}
              height={300}
              alt={user?.firstName + " " + user?.lastName || ""}
              className='w-50 aspect-square rounded-full'
            />
            <Dialog open={imageDialog} onOpenChange={setImageDialog}>
              <DialogTrigger className="absolute curosr-pointer w-full h-full flex flex-col items-center justify-center bg-black/50 rounded-full top-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease">
                <IconUpload size={40} className="text-white" />
                <p className="text-white text-base">
                  Incarca o <br /> fotografie noua
                </p>
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
                      // setPreview(URL.createObjectURL(f));
                    }}
                    setProfilImage={handleChangeProfilePic}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          {isRemoving ? (
            <IconLoader2 
              size={32} 
              className='rotate absolute text-white bg-black hover:bg-black/60 transition-all p-1 rounded-full top-0 right-0' 
            />
          ) : (
            <IconX 
              size={32} 
              onClick={handleImageRemoval}
              className={cn(
                "absolute right-0 top-0 text-white bg-black rounded-full p-1 scale-140 transition-all pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100",
                (!user?.profileImage && !preview) && "group-hover:opacity-40 group-hover:pointer-events-none"
              )}
              cursor="pointer"
            />
          )}
        </div>
        <span className="text-3xl font-extrabold mt-2">
          {user.firstName + " " + user.lastName}
        </span>
      </div>
      <div className="flex flex-col flex-2/3">
        <div className="flex gap-8">
          <div className="flex flex-col flex-1/3 text-2xl">
            <div className="w-full flex items-center justify-between border-b border-[var(--color-primary)]">
              <span>Telefon</span>
              <span className="font-bold">
                {
                  user?.phoneNumber ? (
                    user?.phoneNumber[0] === "0" 
                    ? "+4" +  user?.phoneNumber 
                    : "+40" + user?.phoneNumber
                  )  : "-"
                }
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b border-[var(--color-primary)]">
              <span>Gen</span>
              <span className="font-bold">
                {user.gender === "male" ? "Barbat" : "Femeie"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b border-[var(--color-primary)]">
              <span>Data nasterii</span>
              <span className="font-bold">
                {user?.dob ? format(user?.dob, "PPP", { locale: ro }) : "--/--/----"}
              </span>
            </div>
            {user.role === "author" && (
              <div className="w-full flex items-center justify-between text-2xl border-b border-[var(--color-primary)]">
                <span>Rol</span>
                <span className="font-bold">Autor</span>
              </div>
            )}
          </div>
          <div className="flex-1/4 flex flex-col gap-2">
            <span className="w-full text-2xl border-b border-[var(--color-primary)]">
              Bio
            </span>
            <div>
              <p>{
                user?.bio 
                  ? truncateText(user?.bio, detailedBio ? user?.bio.length : 150) 
                  : "-"
              }</p>
              {user?.bio && user?.bio?.length > 150 ? (
                <span onClick={() => setDetailedBio(prev => !prev)} className="text-[var(--color-primary)] font-bold cursor-pointer">
                  {"Vezi mai " + (detailedBio ? "putin" : "mult")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 !text-2xl mt-8">
          <div className="flex-1/3">
            <div className="flex items-center gap-1">
              <BsEnvelope size={24} />
              <span>Email</span>
            </div>
            <Input
              placeholder=""
              type="text"
              name="email"
              id="email-preview"
              value={user?.email}
              readOnly
              className="w-full !text-2xl"
            />
          </div>
          <div className="flex-1/3">
            <div className="flex items-center gap-1">
              <FaInstagram size={24} />
              <span>Instagram</span>
            </div>
            <Input
              placeholder=""
              type="text"
              name="instagram"
              id="instagram-preview"
              value={user?.instagram ? "@" + user.instagram : "-"}
              readOnly
              className="w-full !text-2xl"
            />
          </div>
          <div className="flex-1/3">
            <div className="flex items-center gap-1">
              <LuFacebook size={24} />
              <span>Facebook</span>
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
        <Separator />
        <div className='flex items-center gap-6 my-4 text-center justify-center'>
          <span className='text-2xl'>Puncte de fidelitate</span>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>{user?.fidelityPoints || 0}</span>
            <div className='p-1 bg-yellow-400 rounded-full'>
              <IconStar size={24} className=' text-white' />
            </div>
          </div>
        </div>    
      </div>

      <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
        <DialogTrigger className="cursor-pointer border-1 border-none relative group">
          <LiaEdit
            size={48}
            cursor="pointer"
            className="text-[#757575]"
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1">
              <LiaEdit
                size={32} 
                cursor="pointer" 
                className="text-[#757575]" 
              />
              <span className="text-3xl">Editeaza profilul</span>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 !text-2xl">
            <div className="flex w-full items-center gap-2">
              <div className="flex-1/2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-1 text-2xl"
                >
                  <BsEnvelope size={24} />
                  <span>Email</span>
                </Label>
                <Input
                  placeholder=""
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full !text-xl"
                />
              </div>
              <div className="flex-1/2">
                <Label
                  htmlFor="instgram"
                  className="flex items-center gap-1 text-2xl not-required"
                >
                  <FaInstagram size={24} />
                  <span>Instagram</span>
                </Label>
                <Input
                  placeholder="ex: my_profile123"
                  type="text"
                  name="instagram"
                  id="instagram"
                  value={formData.instagram}
                  onChange={handleFormChange}
                  className="w-full !text-xl"
                />
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="flex-1/2">
                <Label
                  htmlFor="facebook"
                  className="flex items-center gap-1 text-2xl not-required"
                >
                  <LuFacebook size={24} />
                  <span>Facebook</span>
                </Label>
                <Input
                  placeholder="ex: my.profile"
                  type="text"
                  name="facebook"
                  id="facebook"
                  value={formData.facebook}
                  onChange={handleFormChange}
                  className="w-full !text-xl"
                />
              </div>
              {!user?.dob ? (
                <div className='flex-1/2'>
                  <Label
                    htmlFor="dob"
                    className="flex items-center gap-1 text-2xl not-required"
                  >
                    <FaRegCalendar size={24} />
                    <span>Data nasterii</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!formData.dob}
                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-white !text-xl"
                      >
                        {formData.dob ? format(formData.dob, "PPP", { locale: ro }) : <span>Alege o data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align='start'>
                      <Calendar
                        mode="single"
                        name="dob"
                        id="dob"
                        selected={formData.dob}
                        onSelect={(date) => setFormData(prev => ({
                          ...prev,
                          dob: date
                        }))}
                        locale={ro} 
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="flex-1/2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-1 text-2xl not-required"
                  >
                    <FaPhoneAlt size={24} />
                    <span>Telefon</span>
                  </Label>
                  <InputGroup className="py-0 bg-transparent placeholder:select-none">
                    <InputGroupAddon align="inline-start" className={"pr-2"}>
                      <span className='text-xl opacity-80'>+40</span>
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="Telefon"
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData?.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="w-full !text-xl"
                    />
                  </InputGroup>
                </div>
              )}

            </div>
            {!user?.dob && (
              <div className="w-full">
                <Label
                  htmlFor="phoneNumber"
                  className="flex items-center gap-1 text-2xl not-required"
                >
                  <FaPhoneAlt size={24} />
                  <span>Telefon</span>
                </Label>
                <InputGroup className="py-0 bg-transparent placeholder:select-none">
                  <InputGroupAddon align="inline-start" className={"pr-2"}>
                    <span className='text-xl opacity-80'>+40</span>
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder=""
                    type="number"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData?.phoneNumber || ""}
                    onChange={handleFormChange}
                    className="w-full !text-xl"
                  />
                </InputGroup>
              </div>
            )}
            <div className="w-full">
              <Label
                htmlFor="bio"
                className="flex items-center gap-1 text-2xl not-required"
              >
                <CgFormatLeft size={24} />
                <span>Bio</span>
              </Label>
              <Textarea
                placeholder=""
                name="bio"
                id="bio"
                value={formData.bio}
                onChange={handleFormChange}
                className="w-full h-40! !text-xl"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 w-full mt-4">
            <Button
              variant={"outline"}
              onClick={() => setFormData(defaults)}
              size={"icon"}
              className={"flex-1/3"}
            >
              <IconRotate size={24} />
              Reseteaza
            </Button>
            <Button
              disabled={isDisabled}
              onClick={handleUpdateProfile}
              className="flex-2/3 cursor-pointer bg-[var(--color-primary)] border-1"
              title="Actualizeaza-ti profilul"
            >
              {isDisabled ? (
                <AiOutlineLoading3Quarters className="rotate" />
              ) : (
                <span>Confirma</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserView;