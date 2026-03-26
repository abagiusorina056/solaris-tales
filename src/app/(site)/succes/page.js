"use client"
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "@public/logo.png"
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createOrder } from "@src/lib/utils";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      createOrder(sessionId)
        .then(res => {
          if (res.response.ok) {
            router.push(`/comanda/${res.orderId}`);
          } else {
            console.error("Failed to create order");
          }
        })
    }
  }, [sessionId, router]);

  return (
    <div className='relative h-full w-full'>
      <div className='flex items-center absolute justify-between w-full top-0 px-8'>
        <Image 
          src={logo}
          className='w-40'
          alt=''
        />
        <span className='uppercase text-2xl'>Solaris Tales</span>
      </div>
      <div className='flex flex-col items-center justify-center h-dvh text-3xl'>
        <AiOutlineLoading3Quarters size={96} className="rotate mb-8" />
        <p>Procesam comanda ta</p>
        <p className='flex items-baseline gap-1'>Te rugam sa astepti.</p>
      </div>

    </div>
  );
}