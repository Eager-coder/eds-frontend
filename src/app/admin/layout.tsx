import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { LanguageProvider } from "@/components/language-provider"
import AdminSidebar from "@/components/admin-sidebar/admin-sidebar"
import AdminHeader from "@/components/admin-header"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LanguageProvider>
      
        <div className="flex min-h-screen">
          <SidebarProvider>
            <AdminSidebar />
          </SidebarProvider>
          <div className="w-full">
            <AdminHeader />
            <main className="p-6">{children}</main>
          </div>
        </div>
      
    </LanguageProvider>
  )
}

