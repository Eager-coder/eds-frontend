"use client";

import { Clock, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  declarationId: string;
  startDate: string;
  dueDate: string;
}

interface NotificationsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSidebar({ open, onOpenChange }: NotificationsSidebarProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Please check the initial declaration DEC-D2435",
      subtitle: "ЖЦД Декларации DEC-D2345",
      timestamp: "Today at 6:34 PM",
      declarationId: "DEC-00301",
      startDate: "1/25/2024 6:02 PM",
      dueDate: "1/25/2024 6:22 PM",
    },
    {
      id: "2",
      title: "Please check the initial declaration DEC-D2435",
      subtitle: "ЖЦД Декларации DEC-D2345",
      timestamp: "Today at 6:34 PM",
      declarationId: "DEC-00302",
      startDate: "1/25/2024 6:02 PM",
      dueDate: "1/25/2024 6:22 PM",
    },
    // Add more mock tasks as needed
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setApprovalDialogOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Business process tasks</SheetTitle>
            <div className="flex items-center justify-between mt-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="future-tasks" />
                <Label htmlFor="future-tasks">Show future tasks</Label>
              </div>
            </div>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-20">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 mt-1 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{task.timestamp}</span>
                    </div>
                    <p className="text-blue-600 hover:underline mb-1">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Please check the Initial Declaration {selectedTask?.declarationId}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Start</h4>
                <p className="text-sm">{selectedTask?.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Due</h4>
                <p className="text-sm">{selectedTask?.dueDate}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
              <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                Not Started
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Result</h4>
              <RadioGroup defaultValue="no-conflict">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-conflict" id="no-conflict" />
                  <Label htmlFor="no-conflict">Initial Declaration received - no conflict</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conflict" id="conflict" />
                  <Label htmlFor="conflict">
                    Initial Declaration received - conflict identified
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setApprovalDialogOpen(false)}
            >
              No, cancel
            </Button>
            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">Yes, Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
