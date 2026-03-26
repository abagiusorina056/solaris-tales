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
import { useUsers } from "@src/hooks/useUsers";
import { useUser } from "@src/hooks/useUser";
import { IconDashboard } from "@tabler/icons-react";
import { Separator } from "@src/components/ui/separator";

const Navbar = () => {
	const { user } = useUser()
	const [bag, setBag] = useState(user?.bagBooks || []);
	const [favs, setFavs] = useState(user?.favoriteBooks || [])
		
	useEffect(() => {
		socket.on("favorite", ({ favorites, bookId }) => {
			setFavs(favorites)
		});
		socket.on("bag", ({ newBagContent, newQuantities}) => {
			setBag(newBagContent)
		});
		socket.on("order-placed", () => setBag([]))

		return () => {
			socket.off("favorite");
			socket.off("bag");
			socket.off("order-placed");
		};
	})

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
						<Link href="/autori" className="uppercase">
							Autori
						</Link>
						<Link href="/carti" className="uppercase">
							Carti
						</Link>
						<Link href="/despre-noi" className="uppercase">
							Despre Noi
						</Link>
						{user?.role !== "author" && (
							<Link href="/publica-cu-noi" className="uppercase">
								Publica
							</Link>
						)}
					</div>
				</div>
				<div className="flex items-center gap-7">
					<form className="flex items-center bg-[var(--color-primary)] rounded-sm px-3 py-0.5">
						<Input
							placeholder="Cauta..."
							type="text"
							name="search"
							id="search"
							autoComplete="off"
							className="w-full p-0 border-0 ring-0 outline-0 bg-transparent text-white placeholder:text-white placeholder:select-none"
						/>
						<FaSearch size={28} className="text-white" cursor="pointer" />
					</form>

					{/* {user && (
						<IoNotificationsOutline size={32} cursor="pointer" />
					)} */}
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
									{favs.length ? (
										<span>({favs?.length} {favs.length === 1 ? "produs" : "produse"})</span>
									) : null}
								</div>
								<hr className="w-full border-1 border-gray-200" />
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
													<Button className="flex flex-1/2 items-end w-full cursor-pointer bg-[var(--color-primary)]">
														<BsBagPlusFill size={32} className="scale-120" />
													</Button>
													<Button className="flex flex-1/2 items-end w-full cursor-pointer">
														<FaRegTrashCan size={32} className="scale-120" />
													</Button>
												</div>
											</div>
										</div>
										<hr className="w-full border-1 border-gray-200" />
										<div className="mt-2">
											<Link href="/profil#favorite">
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
					<Link href="/profil">
						<FaRegUser size={32} className="cursor-pointer" title="Profil" />
					</Link>
					<Link href="/cos">
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
					{user.role === "admin" && (
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
