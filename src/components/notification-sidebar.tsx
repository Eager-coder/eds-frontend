'use client';

import { Clock, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useGetNotifications } from '@/api-client/common/getNotifications';

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

	const { user } = useUser();
	const { data } = useGetNotifications(user?.email, {
		enabled: !!user
	});

	console.log(data);
	// Mock tasks data
	const tasks: Task[] = [
		{
			id: '1',
			title: 'Please check the initial declaration DEC-D2435',
			subtitle: 'ЖЦД Декларации DEC-D2345',
			timestamp: 'Today at 6:34 PM',
			declarationId: 'DEC-00301',
			startDate: '1/25/2024 6:02 PM',
			dueDate: '1/25/2024 6:22 PM'
		},
		{
			id: '2',
			title: 'Please check the initial declaration DEC-D2435',
			subtitle: 'ЖЦД Декларации DEC-D2345',
			timestamp: 'Today at 6:34 PM',
			declarationId: 'DEC-00302',
			startDate: '1/25/2024 6:02 PM',
			dueDate: '1/25/2024 6:22 PM'
		}
		// Add more mock tasks as needed
	];

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setApprovalDialogOpen(true);
	};

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange} modal>
				<SheetContent className="w-[400px] bg-white p-0 sm:w-[540px]">
					<SheetHeader className="border-b p-6">
						<SheetTitle>Business process tasks</SheetTitle>
					</SheetHeader>
					<div className="h-full overflow-y-auto pb-20">
						{tasks.map((task) => (
							<div
								key={task.id}
								className="cursor-pointer border-b p-4 hover:bg-gray-50"
								onClick={() => handleTaskClick(task)}
							>
								<div className="flex items-start gap-3">
									<User className="mt-1 h-5 w-5 text-gray-500" />
									<div className="flex-1">
										<div className="mb-1 flex items-center gap-2">
											<Clock className="h-4 w-4 text-gray-500" />
											<span className="text-sm text-gray-500">{task.timestamp}</span>
										</div>
										<p className="mb-1 text-[#DDAF53] hover:underline">{task.title}</p>
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
						<DialogTitle>Please check the Initial Declaration {selectedTask?.declarationId}</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="mb-1 text-sm font-medium text-gray-500">Start</h4>
								<p className="text-sm">{selectedTask?.startDate}</p>
							</div>
							<div>
								<h4 className="mb-1 text-sm font-medium text-gray-500">Due</h4>
								<p className="text-sm">{selectedTask?.dueDate}</p>
							</div>
						</div>

						<div>
							<h4 className="mb-2 text-sm font-medium text-gray-500">Status</h4>
							<Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
								Not Started
							</Badge>
						</div>

						<div>
							<h4 className="mb-2 text-sm font-medium text-gray-500">Result</h4>
							<RadioGroup defaultValue="no-conflict">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="no-conflict" id="no-conflict" />
									<Label htmlFor="no-conflict">Initial Declaration received - no conflict</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="conflict" id="conflict" />
									<Label htmlFor="conflict">Initial Declaration received - conflict identified</Label>
								</div>
							</RadioGroup>
						</div>
					</div>
					<DialogFooter className="gap-2">
						<Button variant="outline" className="flex-1" onClick={() => setApprovalDialogOpen(false)}>
							No, cancel
						</Button>
						<Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">Yes, Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
