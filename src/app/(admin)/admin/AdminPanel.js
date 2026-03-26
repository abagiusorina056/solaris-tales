"use client"
import { AppSidebar } from "@src/components/app-sidebar"
import { SiteHeader } from "@src/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@src/components/ui/sidebar"

export default function AdminPanel({ children }) {
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