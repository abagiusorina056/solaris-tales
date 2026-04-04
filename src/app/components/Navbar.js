"use client";

import React, { useEffect, useState } from "react";
import logo from "@public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaRegUser, FaSearch } from "react-icons/fa";
import { Input } from "@src/components/ui/input";
import { Badge } from "@src/components/ui/badge";
import { BsBagFill, BsBagPlusFill } from "react-icons/bs";
import { socket } from "@src/lib/socketClient";
import { cn, truncateText } from "@src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@src/components/ui/popover";
import { Button } from "@src/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { useUser } from "@src/hooks/useUser";
import { IconDashboard, IconLoader2 } from "@tabler/icons-react";
import { Separator } from "@src/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { LuHeartOff } from "react-icons/lu";
import { bagItem, changeFavorite } from "@src/lib/user";
import { toast } from "sonner";
import NotificationsDialog from "./NotificationsDialog";

const Navbar = () => {
	const { data: user, invalidateUser } = useUser()
	const pathname = usePathname() 
	const router = useRouter()
	const [search, setSearch] = useState("")
	const [isAddingToBag, setIsAddingToBag] = useState(false)
	const [isRemovingFav, setIsRemovingFav] = useState(false)
	const favs = user?.favoriteBooks || []
	const bag = user?.bagBooks || []
	
	const handleAddToBag = () => {
		setIsAddingToBag(true)

		bagItem(favs[0]._id, user._id, "add")
			.then(() => {
				toast.success("Cartea a fost adaugata in cos")
				setIsAddingToBag(false)
			})
	}

	const handleChangeFavorite = () => {
		setIsRemovingFav(true)

		changeFavorite(favs[0]._id, user._id, "add")
			.then(() => {
				toast.success("Cartea a fost eliminata de la favorite")
				setIsRemovingFav(false)
			})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (search.length === 0) {
			return
		}

		router.push(`/carti?term=${search}`)

		setTimeout(() => setSearch(""), 100)
	}

	useEffect(() => {
		socket.on("favorite", ({ favorites, bookId }) => {
			invalidateUser()
		});
		socket.on("bag", ({ newBagContent, newQuantities}) => {
			invalidateUser()
		});
		socket.on("order-placed", () => invalidateUser())
		socket.on("newNotification", () => invalidateUser())

		return () => {
			socket.off("favorite");
			socket.off("bag");
			socket.off("order-placed");
			socket.off("newNotification");
		};
	}, [invalidateUser])

	return (
		<nav className="w-full px-24 py-3 text-[var(--color-primary)] shadow-xl">
				<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-10">
					<Link href="/" className="flex items-center">
						<Image src={logo} alt="Solaris Tales" />
						<div className="flex flex-col items-start justify-center leading-7 text-3xl font-semibold select-none">
							<h2>Solaris</h2>
							<h2>Tales</h2>
						</div>
					</Link>
					<div className="flex items-center font-light gap-12 text-2xl">
						<Link 
							href="/autori" 
							disabled={pathname.includes("/autori")}
							className="uppercase"
						>
							Autori
						</Link>
						<Link 
							href="/carti" 
							disabled={pathname.includes("/carti")}
							className="uppercase"
						>
							Carti
						</Link>
						<Link 
							href="/despre-noi" 
							disabled={pathname.includes("/despre-noi")}
							className="uppercase"
						>
							Despre Noi
						</Link>
						{user?.role !== "author" && (
							<Link 
								href="/publica-cu-noi" 
								disabled={pathname.includes("/autori")}
								className="uppercase"
							>
								Publica
							</Link>
						)}
					</div>
				</div>
				<div className="flex items-center gap-7">
					<form
						onSubmit={handleSubmit}
						className="flex items-center bg-[var(--color-primary)] rounded-sm pl-3 py-0.5"
					>
						<Input
							placeholder="Cauta..."
							type="text"
							name="search"
							id="search"
							disabled={pathname.includes("/carti")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							autoComplete="off"
							className="w-full p-0 border-0 ring-0 outline-0 bg-transparent text-white placeholder:text-white placeholder:select-none"
						/>
						<Button className="bg-transparent hover:bg-transparent p-0">
							<FaSearch 
								size={28} 
								className="text-white" 
								cursor="pointer" 
							/>
						</Button>
					</form>

					{user && (
						<NotificationsDialog 
							user={user}
							invalidate={invalidateUser}
						/>
					)}
					<div className="relative">
						<Popover>
							<PopoverTrigger asChild>
								<div>
									{favs?.length ? (
										<Badge
											variant="default"
											className="bg-[var(--color-primary)] p-1 aspect-square! text-white rounded-full top-0 right-0 translate-x-1/4 select-none"
										/>
									) : null}
									<FaRegHeart size={32} cursor="pointer" />
								</div>
							</PopoverTrigger>
							<PopoverContent align="end" className={cn("w-120 text-[var(--color-primary)] font-semibold", !favs?.length && "flex flex-col items-center")}>							
								<div className="flex w-full justify-between">
									<span>Favorite</span>
									{favs?.length ? (
										<span>({favs?.length} {favs?.length === 1 ? "produs" : "produse"})</span>
									) : null}
								</div>
								<Separator />
								{favs?.length ? (
									<>
										<div className="flex w-full my-2 gap-2">
											<Image 
												src={favs[0].image} 
												width={300}
												height={300}
												className="w-1/4 aspect-[1/1.5]"
												alt=""
											/>
											<div className="flex-3/4 text-black">
												<div className="flex w-full justify-between text-xl">
													<span>{favs[0]?.title}</span>
													<span>{favs[0]?.price} RON</span>
												</div>
												<span>{favs[0]?.author}</span>
												<p className="opacity-60 text-base mt-2">{truncateText(favs[0]?.description, 100)}</p>
												<div className="flex items-center gap-2 mt-1">
													<Button
														onClick={handleAddToBag}
														disabled={isAddingToBag}
														className="flex flex-1/2 items-end w-full cursor-pointer bg-[var(--color-primary)]"
													>
														{isAddingToBag ? (
															<IconLoader2 className="rotate" />
														) : (
															<BsBagPlusFill size={32} className="scale-120" />
														)}
													</Button>
													<Button
														onClick={handleChangeFavorite}
														disabled={isRemovingFav}
														className="flex flex-1/2 items-end w-full cursor-pointer"
													>
														{isRemovingFav ? (
															<IconLoader2 className="rotate" />
														) : (
															<LuHeartOff size={32} className="scale-120" />
														)}
													</Button>
												</div>
											</div>
										</div>
										<Separator />
										<div className="mt-2">
											<Link 
												href="/profil#favorite"
												disabled={pathname.includes("/profil")}
											>
												<span className="text-cneter w-full px-2 py-1 border border-[var(--color-primary)] rounded-sm">Vezi toate favoritele</span>
											</Link>
										</div>
									</>
								) : (
									<span className="py-4">Nu ai favorite</span>
								)}
							</PopoverContent>
						</Popover>
					</div>
					<Link 
						href="/profil"
						disabled={pathname.includes("/profil")}
					>
						<FaRegUser size={32} className="cursor-pointer" title="Profil" />
					</Link>
					<Link 
						href="/cos"
						disabled={pathname.includes("/cos")}
					>
						<div className="relative cursor-pointer">
							{bag?.length ? (
								<Badge
									variant="default"
									className="bg-[var(--color-primary)] text-white rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/3 select-none"
								>
									{bag?.length}
								</Badge>
							) : null}
							<BsBagFill size={32} cursor="pointer" />
						</div>
					</Link>
					{user?.role === "admin" && (
						<span className="h-8 flex items-center gap-5">
							<Separator orientation="vertical" className={"h-5 border-1 border-[var(--color-primary)] bg-[var(--color-primary)]"} />
							<Link href="/admin/dashboard">
								<IconDashboard size={32} cursor={"pointer"} />
							</Link>
						</span>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
