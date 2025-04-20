"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import Link from "next/link"

interface Declaration {
  id: string
  type: "Initial Declaration" | "Ad hoc"
  creationDate: string
  createdBy: string
  closeDate?: string
  closeBy?: string
  isActive: boolean
}

export default function DeclarationEditorPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deprecationDateFilter, setDeprecationDateFilter] = useState("all")
  const [creationDateFilter, setCreationDateFilter] = useState("all")

  // Mock data
  const declarations: Declaration[] = [
    {
      id: "1",
      type: "Initial Declaration",
      creationDate: "01/01/2010",
      createdBy: "Askar Boranbayev",
      isActive: true,
    },
    {
      id: "2",
      type: "Ad hoc",
      creationDate: "01/01/2010",
      createdBy: "Askar Boranbayev",
      isActive: true,
    },
    {
      id: "1",
      type: "Initial Declaration",
      creationDate: "01/01/2010",
      createdBy: "Askar Boranbayev",
      closeDate: "01/01/2025",
      closeBy: "Azat Akash",
      isActive: false,
    },
    {
      id: "2",
      type: "Ad hoc",
      creationDate: "01/01/2010",
      createdBy: "Askar Boranbayev",
      closeDate: "01/01/2025",
      closeBy: "Azat Akash",
      isActive: false,
    },
  ]

  const activeDeclarations = declarations.filter((declaration) => declaration.isActive)

  // Filter inactive declarations based on search query and filters
  const filteredInactiveDeclarations = declarations.filter((declaration) => {
    if (declaration.isActive) return false

    // Search filter
    const searchMatch =
      searchQuery === "" ||
      declaration.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.closeBy?.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const typeMatch = typeFilter === "all" || declaration.type === typeFilter

    // We would implement date filters here in a real application
    // For now, we'll just return true for these filters
    const deprecationDateMatch = true
    const creationDateMatch = true

    return searchMatch && typeMatch && deprecationDateMatch && creationDateMatch
  })

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Active Declarations</h2>
          <span className="text-red-500 text-lg">(only 1 declaration per type can be active)</span>
        </div>
        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead className="w-[100px] text-right">Edit Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDeclarations.map((declaration) => (
                <TableRow key={`${declaration.type}-${declaration.id}-active`} className="hover:bg-slate-50">
                  <TableCell>{declaration.id}</TableCell>
                  <TableCell>{declaration.type}</TableCell>
                  <TableCell>{declaration.creationDate}</TableCell>
                  <TableCell>{declaration.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/declaration-editor/${declaration.type.toLowerCase().replace(/\s+/g, "-")}/${declaration.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Inactive Declarations</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search"
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Initial Declaration">Initial Declaration</SelectItem>
              <SelectItem value="Ad hoc">Ad hoc</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deprecationDateFilter} onValueChange={setDeprecationDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Deprecation date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={creationDateFilter} onValueChange={setCreationDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Creation date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2010">2010</SelectItem>
              <SelectItem value="2009">2009</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Close date</TableHead>
                <TableHead>Close by</TableHead>
                <TableHead className="w-[80px] text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInactiveDeclarations.map((declaration) => (
                <TableRow key={`${declaration.type}-${declaration.id}-inactive`} className="hover:bg-slate-50">
                  <TableCell>{declaration.id}</TableCell>
                  <TableCell>{declaration.type}</TableCell>
                  <TableCell>{declaration.creationDate}</TableCell>
                  <TableCell>{declaration.createdBy}</TableCell>
                  <TableCell>{declaration.closeDate}</TableCell>
                  <TableCell>{declaration.closeBy}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/declaration-editor/${declaration.type.toLowerCase().replace(/\s+/g, "-")}/${declaration.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
