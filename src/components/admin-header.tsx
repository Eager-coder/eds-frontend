"use client"

import React from "react"

import Link from "next/link"
import { Home } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export default function AdminHeader() {
  const { t } = useLanguage()
  const pathname = usePathname()

  // Create breadcrumb segments from pathname
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex justify-between items-center p-4 border-b w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logoNU.png"
            alt="Nazarbayev University"
            width={260}
            height={50}
            priority
            className="h-12 w-auto"
          />
          <h1 className="text-xl font-semibold">{t("admin.panel")}</h1>
        </div>

        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.slice(1).map((segment, index) => {
              // Skip the ID parameter in the breadcrumb
              if (segment.startsWith("[") && segment.endsWith("]")) {
                return null
              }

              const href = `/admin/${segments.slice(1, index + 2).join("/")}`

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={href}>{t(segment.replace(/-/g, ".")) || segment}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="hidden sm:flex">
          <Link href="/">Back to Main Site</Link>
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

