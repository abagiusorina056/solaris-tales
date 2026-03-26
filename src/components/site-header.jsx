import { Button } from "@src/components/ui/button"
import { Separator } from "@src/components/ui/separator"
import { SidebarTrigger } from "@src/components/ui/sidebar"
import { IconInbox, IconBookUpload, IconBell } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import Link from "next/link";

const pageTitles = [
  {
    path: "/admin/dashboard",
    title: "Dashboard"
  },
  {
    path: "/admin/inbox",
    title: "Inbox"
  },
  {
    path: "/admin/carti",
    title: "Carti"
  },
  {
    path: "/admin/autori",
    title: "Autori"
  },
  {
    path: "/admin/autor",
    title: "Autor"
  },
  {
    path: "/admin/manuscrise",
    title: "Manuscrise"
  },
  {
    path: "/admin/reviews",
    title: "Reviews"
  },
  {
    path: "/admin/cereri",
    title: "Cereri"
  },
  {
    path: "/admin/cont",
    title: "Cont"
  },
  {
    path: "/admin/utilizatori",
    title: "Utilizatori"
  },
  {
    path: "/admin/carte/",
    title: "Carte"
  },
  {
    path: "/admin/utilizator/",
    title: "Utilizator"
  },
  {
    path: "/admin/adauga-carte",
    title: "Adauga Carte"
  },
  {
    path: "/admin/comenzi",
    title: "Comenzi"
  },
  {
    path: "/admin/comanda/",
    title: "Comanda"
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles.filter(p => pathname.includes(p.path))
  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-2">
        <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-xl font-medium">Admin Panel | {title[0].title || ""}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin/adauga-carte">
            <IconBookUpload size={32} />
          </Link>
          <div className="relative mr-8">
            <Badge
              variant="default"
              className="opacity-0 p-1.25 aspect-square! rounded-full top-1 right-1 select-none"
            />
            <span className="opacity-30">
              <IconBell size={32} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
