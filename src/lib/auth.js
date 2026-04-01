import { toast } from "sonner";
import { redirect } from "next/navigation";

export const createUser = async (signUpData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    role,
    rememberMe
  } = signUpData

  const res = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      gender,
      role,
      rememberMe
    }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  } else {
    toast.success("Inregistrare reusita")
    redirect("/")
  }
}

export const login = async (loginData) => {
  const { email, password, rememberMe } = loginData
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      rememberMe
    })
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  } else {
    toast.success("Autentificare reusita")
  }
}

export const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}