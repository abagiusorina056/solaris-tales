import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { Toaster } from "sonner";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TiWarningOutline } from "react-icons/ti";
import { FiXCircle } from "react-icons/fi";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Solaris Tales",
  description: "Idk...",
  icons: {
    icon: "/logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        <Toaster
          icons={{
            success: <FaRegCircleCheck color="green" size={20} />,
            info: <IoMdInformationCircleOutline color="blue" size={20} />,
            warning: <TiWarningOutline color="#dbac02" size={20} />,
            error: <FiXCircle color="red" size={20} />,
          }}
          toastOptions={{
            style: {
              fontSize: "16px"
            }
          }}
        />
      </body>
    </html>
  );
}
