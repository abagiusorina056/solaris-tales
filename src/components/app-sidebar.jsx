"use client"

import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFeather,
  IconUsers,
  IconBook,
  IconInbox,
  IconStar,
  IconMessageQuestion,
  IconScript,
  IconBookUpload,
  IconHome2,
  IconBooks,
  IconInfoOctagon,
  IconHelpOctagon,
  IconReceipt,
  IconWriting
} from "@tabler/icons-react"

import { NavDocuments } from "@src/components/nav-documents"
import { NavMain } from "@src/components/nav-main"
import { NavSecondary } from "@src/components/nav-secondary"
import { NavUser } from "@src/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@src/components/ui/sidebar"
import Image from "next/image"
import logo from "@public/logo-black.png"
import { useAdmin } from "@src/hooks/useAdmin"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Carti",
      url: "/admin/carti",
      icon: IconBook,
    },
    {
      title: "Comenzi",
      url: "/admin/comenzi",
      icon: IconReceipt,
    },
    {
      title: "Autori",
      url: "/admin/autori",
      icon: IconFeather,
    },
    {
      title: "Utilizatori",
      url: "/admin/utilizatori",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: false,
      url: "/admin/proposals",
      items: [
        {
          title: "Active Proposals",
          url: "/admin/proposals-active",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  documents: [
    {
      name: "Manuscrise",
      url: "/admin/manuscrise",
      icon: IconScript,
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: IconStar,
    },
    {
      name: "Cereri",
      url: "/admin/cereri",
      icon: IconMessageQuestion,
    },
    {
      name: "Adauga carte",
      url: "/admin/adauga-carte",
      icon: IconBookUpload,
    },
  ],
  mainApp: [
    {
      name: "Acasa",
      url: "/#",
      icon: IconHome2,
    },
    {
      name: "Carti",
      url: "/carti#",
      icon: IconBooks,
    },
    {
      name: "Autori",
      url: "/autori#",
      icon: IconWriting,
    },
    {
      name: "Despre noi",
      url: "/despre-noi",
      icon: IconInfoOctagon,
    },
    {
      name: "Informatii utile",
      url: "/informatii-utile",
      icon: IconHelpOctagon,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { data: admin } = useAdmin()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-2">
              <a href="">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-10"
                />
                <span className="text-base font-semibold">Solaris Tales</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} title="Documente" />
        <NavDocuments items={data.mainApp} title="Site principal" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={admin} />
      </SidebarFooter>
    </Sidebar>
  );
}
