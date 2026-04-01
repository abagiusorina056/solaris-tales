"use client"
import { AppSidebar } from "@src/components/app-sidebar"
import { SiteHeader } from "@src/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@src/components/ui/sidebar"
import { useAdmin } from "@src/hooks/useAdmin";

export default function AdminPanel({ children, admin }) {
  const { data } = useAdmin(admin);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)"
        }
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}