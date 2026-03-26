"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import loginImg from "@public/login-img.png";
import { Input } from "@src/components/ui/input";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Label } from "@src/components/ui/label";
import { Checkbox } from "@src/components/ui/checkbox";
import { Button } from "@src/components/ui/button";
import { Switch } from "@src/components/ui/switch";
import { createUser } from "@src/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@src/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select"
import { toast } from "sonner";
import { validateSignUpForm } from "@src/lib/utils";

const SignUp = () => {
	const defaultValues = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		role: "user",
		gender: "",
		rememberMe: false
	}

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formData, setFormData] = useState(defaultValues)
	const [confirmPassword, setConfirmPassword] = useState("")
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
		setDisabled(true)

		const isValid = validateSignUpForm(formData, confirmPassword)
		if (!isValid) {
			setDisabled(false)
			return
		}

		createUser({
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			password: formData.password,
			gender: formData.gender,
			role: formData.role ? formData.role : "user",
			rememberMe: formData.rememberMe
		})
		.then(() => setDisabled(false));
	};

	return (
		<div className="w-full h-full flex items-center overflwo-hidden relative">
			<div className="flex-3/5 flex flex-col items-center justify-center bg-[#F4FFF8] h-[100vh]">
				<div className="tracking-widest font-thing uppercase w-full text-center mb-20 ">
					<h1 className="text-[var(--color-primary)] text-5xl">Inregistrare</h1>
					<h2 className="text-[#5E986B]/80 text-3xl">Bine ai venit!</h2>
				</div>

				<form className="w-3/4" onSubmit={handleSubmit}>
					<div className="flex items-center gap-3">
						<div className="flex-1/2">
							<Label
								htmlFor="firstName"
								className="font-semibold text-[#5E986B] text-xl"
							>
								Nume
							</Label>
							<Input
								variant="default"
								type="text"
								id="firstName"
								name="firstName"
								placeholder="John"
								value={formData.firstName}
								onChange={(e) => handleChange(e)}
								className="bg-white py-6 !text-xl"
							/>
						</div>
						<div className="flex-1/2">
							<Label
								htmlFor="lastName"
								className="font-semibold text-[#5E986B] text-xl"
							>
								Prenume
							</Label>
							<Input
								variant="default"
								type="text"
								id="lastName"
								name="lastName"
								placeholder="Doe"
								value={formData.lastName}
								onChange={(e) => handleChange(e)}
								className="bg-white py-6 !text-xl"
							/>
						</div>
					</div>
					<div className="mb-7">
						<Label
							htmlFor="email"
							className="font-semibold text-[#5E986B] text-xl"
						>
							Email
						</Label>
						<Input
							variant="default"
							type="email"
							id="email"
							name="email"
							placeholder="email@example.com"
							value={formData.email}
							onChange={(e) => handleChange(e)}
							className="bg-white py-6 !text-xl"
						/>
					</div>
					<div className="mb-7 w-full flex items-center gap-3">
						<div className="relative flex-1/2">
							<Label
								htmlFor="password"
								className="font-semibold text-[#5E986B] text-xl"
							>
								Parola
							</Label>
							<Input
								variant="default"
								type={passwordVisible ? "text" : "password"}
								id="password"
								name="password"
								placeholder="********"
								value={formData.password}
								onChange={(e) => handleChange(e)}
								className="bg-white py-6 !text-xl"
							/>
							{!passwordVisible ? (
								<LuEye
									size={28}
									className="absolute right-4 top-1/2 text-[#5E986B] cursor-pointer"
									onClick={() => setPasswordVisible(!passwordVisible)}
								/>
							) : (
								<LuEyeOff
									size={28}
									className="absolute right-4 top-1/2 text-[#5E986B] cursor-pointer"
									onClick={() => setPasswordVisible(!passwordVisible)}
								/>
							)}
						</div>
						<div className="flex-1/2">
							<Label
								htmlFor="confirmPassword"
								className="font-semibold text-[#5E986B] text-xl"
							>
								Confirmare Parola
							</Label>
							<Input
								variant="default"
								type={passwordVisible ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								placeholder="********"
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								className="bg-white py-6 !text-xl"
							/>
						</div>
					</div>
					<div className="flex items-end gap-3 text-[#5E986B] text-xl">
						<div className="flex-1/2">
							<Label
								htmlFor="confirmPassword"
								className="font-semibold text-[#5E986B] text-xl"
							>
								Gen
							</Label>
							<Select
								value={formData.gender}
								onValueChange={(value) =>
									setFormData({ ...formData, gender: value })
								}
							>
								<SelectTrigger className="w-full bg-white! text-xl!">
									<SelectValue placeholder="Gen" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="male" className="text-xl!">Barbat</SelectItem>
									<SelectItem value="female" className="text-xl!">Femeie</SelectItem>
									<SelectItem value="walmart-bag" className="text-xl!">Altele (Bolnav mintal)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Label
							htmlFor="author-role"
							className="not-required flex items-center justify-end w-fit gap-2 flex-1/2"
						>
							<span className="font-semibold text-2xl">Autor</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<BsQuestionCircle size={18} className="opacity-80" />
								</TooltipTrigger>
								<TooltipContent>
									<span className="font-light">Selecteaza daca esti autor</span>
								</TooltipContent>
							</Tooltip>
							<Switch
								id="author-role"
								checked={formData.role === "author"}
								onCheckedChange={(checked) =>
									setFormData(prev => ({
										...prev,
										role: checked ? "author" : "user",
									}))
								}
								className="scale-110 bg-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]"
							/>
						</Label>
					</div>
					<div className="flex items-center gap-3 w-fit text-[#5E986B] mt-5 mb-4">
						<Checkbox
							id="remember-me"
							checked={formData.rememberMe}
							onCheckedChange={(checked) =>
								setFormData(prev => ({
									...prev,
									rememberMe: checked,
								}))
							}
							className="border-[#5E986B] data-[state=checked]:border-[#5E986B] data-[state=unchecked]:border-2 border-2 data-[state=checked]:bg-[#5E986B]"
						/>
						<Label htmlFor="remember-me" className="not-required font-semibold text-xl">
							Tine-ma minte
						</Label>
					</div>

					<Button
						type="submit"
						disabled={disabled}
						className="w-full bg-[var(--color-primary)] text-white text-2xl py-6 rounded-sm hover:bg-[(var(--color-primary)] cursor-pointer"
					>
						{disabled ? (
							<AiOutlineLoading3Quarters className="rotate" />
						) : (
							<span>
								Inregistrare
							</span>
						)}
					</Button>
				</form>
				<div className="text-[#5E986B] text-xl text-center mt-5">
					<span className="mr-1">Ai deja un cont?</span>
					<Link href="/login">
						<span className="underline">Autentifica-te</span>
					</Link>
				</div>
				<div className="w-3/4 mt-5 text-center">
					<span className="font-semibold text-sm text-center">
						Apasand butonul de autentificare esti de acord cu
					</span>
					<br />
					<Link href="/login" className="mx-1">
						<span className="underline text-[#5E986B] text-base text-center">
							Termenii si Conditile
						</span>
					</Link>
					<span className="font-semibold text-sm text-center">
						noastre
					</span>
				</div>
			</div>
			<Image
				src={loginImg}
				className="w-full h-[100vh] object-cover object-center"
				alt="Solaris Tales"
			/>
			<Link href="/">
				<span className="absolute top-10 right-10 tracking-widest text-4xl text-white uppercase">
					Solaris Tales
				</span>
			</Link>
		</div>
	);
};

export default SignUp;
