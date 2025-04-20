"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useLanguage()

  // Mock user data - in a real app, you would fetch this from an API
  const user = {
    id,
    firstName: "Askar",
    lastName: "Boranbayev",
    email: "askar.boranbayev@example.kz",
    department: "SEDS",
    position: "Manager",
    regDate: "04 Sep 2019",
    role: "user",
    verified: true,
    phone: "+7 (777) 123-4567",
    address: "Astana, Kazakhstan",
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "manager":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "user":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">
          {t("user")} {t("profile.link")}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {user.firstName} {user.lastName}
          </CardTitle>
          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
            {t(user.role)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("id")}</p>
              <p>{user.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("department")}</p>
              <p>{user.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("position")}</p>
              <p>{user.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("reg.date")}</p>
              <p>{user.regDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("status")}</p>
              <p>{user.verified ? t("verified") : t("not.verified")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{user.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{user.address}</p>
            </div>
          </div>
            <div className="flex justify-end">
                <Button variant="outline" onClick={() => alert("Edit user functionality not implemented")}>
                {t("edit")}
                </Button>
              </div>
        </CardContent>
      </Card>
    </div>
  )
}

