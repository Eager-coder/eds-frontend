"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, User, Truck, FileText, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DeclarationDetails {
  id: string;
  createdBy: string;
  createdOn: string;
  position: string;
  department: string;
  status: string;
}

export default function DeclarationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  console.log(router, params);
  const [isLoading, setIsLoading] = useState(true);
  const [declaration, setDeclaration] = useState<DeclarationDetails | null>(null);

  useEffect(() => {
    // Simulate API call to fetch declaration details
    const fetchDeclaration = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDeclaration({
        id: "DEC-00301",
        createdBy: "Askar Boranbayev",
        createdOn: "1/25/2024 5:43PM",
        position: "Azat Akash",
        department: "IT Innovation",
        status: "Created",
      });
      setIsLoading(false);
    };

    fetchDeclaration();
  }, []);

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
            <Button variant="ghost" size="icon" className="text-gray-600">
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
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="User profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold">{declaration?.id}</h1>
            </div>
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

          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="relative flex items-center justify-between">
              <div className="h-0.5 absolute left-0 right-0 bg-gray-200">
                <div className="h-full w-1/6 bg-gray-600"></div>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm z-10">
                  1
                </div>
                <span className="text-sm mt-2 font-medium">Created</span>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm z-10">
                  2
                </div>
                <span className="text-sm mt-2">Sent for Approval</span>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm z-10">
                  3
                </div>
                <span className="text-sm mt-2">Reviewed - conflict identified</span>
              </div>
            </div>
          </div>

          {/* Declaration Details */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Number</h3>
                <p>{declaration?.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Created by</h3>
                <p className="text-blue-600">{declaration?.createdBy}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Created on</h3>
                <p>{declaration?.createdOn}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Position/Manager</h3>
                <p>{declaration?.position}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Department/Office/School</h3>
                <p>{declaration?.department}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Status</h3>
                <p>{declaration?.status}</p>
              </div>
            </div>
          </div>

          {/* Declaration Questions */}
          <div className="bg-white rounded-lg border p-6 space-y-8">
            <h2 className="text-lg font-semibold mb-6">Initial Declaration</h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  1. I declare that I have no close relatives employed by the autonomous
                  organization of education Nazarbayev University and/or its organizations
                  management bodies.
                </p>
                <RadioGroup defaultValue="confirm" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confirm" id="confirm-1" />
                    <Label htmlFor="confirm-1">Confirm</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  2. I declare that I have no commercial or financial/non-financial interests in
                  entities that seek to, or already have entered in transactions with Nazarbayev
                  University and/or its organizations
                </p>
                <RadioGroup defaultValue="confirm" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confirm" id="confirm-2" />
                    <Label htmlFor="confirm-2">Confirm</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  3. I declare that I have no equity or other financial/non financial interest in a
                  company or organization that acts as a party in litigation or arbitration against
                  Nazarbayev University and/or its organizations.
                </p>
                <RadioGroup defaultValue="confirm" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confirm" id="confirm-3" />
                    <Label htmlFor="confirm-3">Confirm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="do-not-confirm" id="do-not-confirm-3" />
                    <Label htmlFor="do-not-confirm-3">Do not confirm</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  4. Do any of your affiliated persons (excluding close relatives) work at
                  Nazarbayev University and/or its organizations?
                </p>
                <RadioGroup defaultValue="yes" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-4" />
                    <Label htmlFor="yes-4">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-4" />
                    <Label htmlFor="no-4">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  5. Have you engaged in any work, paid or unpaid, other than for Nazarbayev
                  University and/or its organizations or planning to in the next 12 months?
                </p>
                <RadioGroup defaultValue="yes" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-5" />
                    <Label htmlFor="yes-5">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-5" />
                    <Label htmlFor="no-5">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
