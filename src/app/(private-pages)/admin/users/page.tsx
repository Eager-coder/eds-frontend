"use client"

import Link from "next/link"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    department: string
    position: string
    regDate: string
    role: "user" | "manager" | "admin"
    verified: boolean
  }
  
  export default function UsersPage() {
    const { t } = useLanguage()
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
  
    // Mock data
    const [usersState, setUsersState] = useState<User[]>([
        {
          id: "00001",
          firstName: "Askar",
          lastName: "Boranbayev",
          email: "askar.boranbayev@example.kz",
          department: "SEDS",
          position: "Manager",
          regDate: "04 Sep 2019",
          role: "user",
          verified: true,
        },
        {
          id: "00002",
          firstName: "Askar",
          lastName: "Boranbayev",
          email: "askar.boranbayev@example.kz",
          department: "SEDS",
          position: "Manager",
          regDate: "04 Sep 2019",
          role: "manager",
          verified: true,
        },
        {
          id: "00003",
          firstName: "Askar",
          lastName: "Boranbayev",
          email: "askar.boranbayev@example.kz",
          department: "SEDS",
          position: "Manager",
          regDate: "04 Sep 2019",
          role: "admin",
          verified: false,
        },
        {
          id: "00004",
          firstName: "Aizhan",
          lastName: "Mukanova",
          email: "aizhan.mukanova@example.kz",
          department: "HR",
          position: "Specialist",
          regDate: "15 Jan 2020",
          role: "user",
          verified: false,
        },
        {
          id: "00005",
          firstName: "Yerlan",
          lastName: "Tulegenov",
          email: "yerlan.tulegenov@example.kz",
          department: "IT",
          position: "Developer",
          regDate: "22 Mar 2021",
          role: "user",
          verified: true,
        },
      ])
  
    // Filter users based on search query and filters
    const filteredUsers = usersState.filter((user) => {
      // Search filter
      const searchMatch =
        searchQuery === "" ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
  
      // Role filter
      const roleMatch = roleFilter === "all" || user.role === roleFilter
  
      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "verified" && user.verified) ||
        (statusFilter === "not-verified" && !user.verified)
  
      return searchMatch && roleMatch && statusMatch
    })

    const toggleVerified = (id: string) => {
        setUsersState((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, verified: !user.verified } : user
          )
        )
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
        <h1 className="text-2xl font-bold">{t("users")}</h1>
  
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder={t("search")}
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="verified">{t("verified")}</SelectItem>
                <SelectItem value="not-verified">{t("not.verified")}</SelectItem>
              </SelectContent>
            </Select>
  
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="user">{t("user")}</SelectItem>
                <SelectItem value="manager">{t("manager")}</SelectItem>
                <SelectItem value="admin">{t("admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("id")}</TableHead>
                <TableHead>{t("first.name")}</TableHead>
                <TableHead>{t("last.name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("department")}</TableHead>
                <TableHead>{t("position")}</TableHead>
                <TableHead>{t("reg.date")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("valid")}</TableHead>
                <TableHead>{t("profile.link")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.position}</TableCell>

                  <TableCell>{user.regDate}</TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {t(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                        checked={user.verified}
                        className="ml-2"
                        onCheckedChange={() => toggleVerified(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">{t("profile.link")}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        <div className="text-sm text-muted-foreground">
          Showing 1-{filteredUsers.length} of {filteredUsers.length}
        </div>
      </div>
    )
  }
  