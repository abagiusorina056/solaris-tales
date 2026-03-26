"use client"
import React from 'react'
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';
import { cn, excludedRoutes } from '@src/lib/utils';
import Footer from './Footer';
import { useUser } from '@src/hooks/useUser';

const ShellWrapper = ({ children }) => {
  const pathname = usePathname();
  console.log(pathname, excludedRoutes)
  const hideLayout = excludedRoutes.includes(pathname);
  console.log(hideLayout)

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="font-sans max-w-full">
        <main className={cn("flex flex-col row-start-2 items-center sm:items-start shadow-2xl bg-[#F7F7F7]", !hideLayout && "mx-32 pb-10")}>
          {children}
        </main>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}

export default ShellWrapper