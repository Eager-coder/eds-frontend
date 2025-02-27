"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Truck,
  FileText,
  Plus,
  Filter,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsSidebar } from "@/components/notification-sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{ email: string } | null>(null);
  const [notificationsSidebarOpen, setNotificationsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Get user data
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        setUserData(JSON.parse(userDataStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/placeholder.svg?height=50&width=260"
            alt="Nazarbayev University"
            width={260}
            height={50}
            className="h-12 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              5
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={() => setNotificationsSidebarOpen(true)}
            >
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Notifications"
                width={24}
                height={24}
              />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="relative group">
            <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="User profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{userData?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-50">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Sultan Turan</h2>
            <p className="text-sm text-gray-500">sultan.turan@nu.edu.kz</p>
          </div>
          <nav className="p-2">
            <div className="bg-amber-100 rounded-md p-3 mb-1 flex items-center gap-3 font-medium">
              <User className="h-5 w-5" />
              <span>Initial Declaration</span>
            </div>
            <div className="hover:bg-gray-100 rounded-md p-3 mb-1 flex items-center gap-3">
              <Truck className="h-5 w-5" />
              <span>Ad hoc Declaration</span>
            </div>
            <div className="hover:bg-gray-100 rounded-md p-3 mb-1 flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>Management Plan</span>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Initial declaration</h1>
            <div className="flex gap-3">
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Plus className="h-4 w-4 mr-2" /> Add new
              </Button>
              <Button variant="outline">Import</Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-md border mb-6">
            <div className="flex items-center p-2 flex-wrap gap-2">
              <div className="flex items-center px-2">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Filter By</span>
              </div>

              <div className="flex items-center gap-2 flex-grow">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Created By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="me">Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="sm" className="text-red-500 flex items-center">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-md border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Created By</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Created On</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    id: "00001",
                    createdBy: "Askar Boranbayev",
                    createdOn: "04 Sep 2019",
                    status: "Completed",
                  },
                  {
                    id: "00002",
                    createdBy: "Azat Akash",
                    createdOn: "28 May 2019",
                    status: "Processing",
                  },
                  {
                    id: "00003",
                    createdBy: "John Doe",
                    createdOn: "23 Nov 2019",
                    status: "Rejected",
                  },
                  {
                    id: "00004",
                    createdBy: "Joe Doe",
                    createdOn: "05 Feb 2019",
                    status: "Completed",
                  },
                ].map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/declaration/${row.id}`)}
                  >
                    <td className="px-6 py-4 text-sm">{row.id}</td>
                    <td className="px-6 py-4 text-sm">{row.createdBy}</td>
                    <td className="px-6 py-4 text-sm">{row.createdOn}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Badge
                        className={cn({
                          "bg-emerald-100 text-emerald-800 hover:bg-emerald-100":
                            row.status === "Completed",
                          "bg-purple-100 text-purple-800 hover:bg-purple-100":
                            row.status === "Processing",
                          "bg-red-100 text-red-800 hover:bg-red-100": row.status === "Rejected",
                        })}
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 text-sm text-gray-500 border-t">Showing 1-09 of 78</div>
          </div>
        </main>
      </div>
      <NotificationsSidebar
        open={notificationsSidebarOpen}
        onOpenChange={setNotificationsSidebarOpen}
      />
    </div>
  );
}

// Placeholder for NotificationsSidebar component.  You'll need to define this component separately.
// const NotificationsSidebar = ({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (value: boolean) => void;
// }) => {
//   console.log(onOpenChange);
//   return <div>Notifications Sidebar {open ? <NotificationsSidebar : "Closed"}</div>;
// };
