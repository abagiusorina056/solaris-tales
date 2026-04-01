import { Button } from "@src/components/ui/button"
import React from "react";
import { Separator } from "@src/components/ui/separator"
import { SidebarTrigger } from "@src/components/ui/sidebar"
import { IconInbox, IconBookUpload, IconBell, IconChecks, IconBellX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useUser } from "@src/hooks/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from "@src/lib/utils";
import NotificationsDialog from "@src/app/components/NotificationsDialog";
import { useAdmin } from "@src/hooks/useAdmin";

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
    path: "/admin/profil",
    title: "Profil"
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
  const { data: admin, invalidateAdmin } = useAdmin()
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

          <NotificationsDialog 
            user={admin} 
            invalidate={invalidateAdmin}
            isDashboard
          />
        </div>
      </div>
    </header>
  );
}
