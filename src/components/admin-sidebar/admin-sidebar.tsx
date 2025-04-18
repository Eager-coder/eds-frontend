"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, FileEdit, FileText, FileCode, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useLanguage } from "../language-provider"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      title: t("users"),
      href: "/admin/users",
      icon: Users,
    },
    {
      title: t("declaration.editor"),
      href: "/admin/declaration-editor",
      icon: FileEdit,
    },
    {
      title: t("initial.declaration"),
      href: "/admin/initial-declaration",
      icon: FileText,
    },
    {
      title: t("ad.hoc"),
      href: "/admin/ad-hoc",
      icon: FileCode,
    },
    {
      title: t("management.plan"),
      href: "/admin/management-plan",
      icon: BarChart3,
    },
  ]

//   return (
//     <Sidebar>
    //   <SidebarHeader className="border-b p-4">
    //     <div className="flex flex-col">
    //       <h2 className="font-semibold">{t("admin.panel")}</h2>
    //       <p className="text-xs text-muted-foreground">admin@example.com</p>
    //     </div>
    //   </SidebarHeader>
    //   <SidebarContent>
    //     <SidebarMenu>
    //       {navItems.map((item) => (
    //         <SidebarMenuItem key={item.href}>
    //           <SidebarMenuButton asChild isActive={pathname === item.href}>
    //             <Link href={item.href}>
    //               <item.icon className="h-4 w-4" />
    //               <span>{item.title}</span>
    //             </Link>
    //           </SidebarMenuButton>
    //         </SidebarMenuItem>
    //       ))}
    //     </SidebarMenu>
    //   </SidebarContent>
//     </Sidebar>
//   )
// }


  return (
    <Sidebar>
         <SidebarHeader className="p-4">
        <div className="flex flex-col">
          <h2 className="font-semibold">{t("admin.panel")}</h2>
          <p className="text-xs text-muted-foreground">admin@example.com</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} >
              <SidebarMenuButton asChild isActive={pathname === item.href} >
                <Link href={item.href} >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      </Sidebar>
  )
}
