import React, { JSX, useState } from 'react';
import { Clock, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/context/UserContext';
import { useGetNotifications } from '@/api-client/common/getNotifications';
import Link from 'next/link';
import { Label } from './ui/label';
import { format } from 'date-fns';

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

// Function to replace URLs with the Next.js Link component
const replaceLinksWithComponent = (text: string, closeSidebar: () => void): JSX.Element[] => {
	// Regular expression to find URLs
	const urlRegex = /(https?:\/\/[^\s]+)/g;

	// Split the string by URLs and map the text and links
	const parts = text.split(urlRegex);

	return parts.map((part, index) => {
		if (urlRegex.test(part)) {
			// If the part is a URL, wrap it with the Link component and close the sidebar when clicked
			return (
				<Link
					className="font-bold text-orange-600 underline"
					href={part}
					onClick={() => closeSidebar()}
					key={index}
					passHref
				>
					Link
				</Link>
			);
		} else {
			// If the part is text, return it as normal
			return <React.Fragment key={index}>{part}</React.Fragment>;
		}
	});
};

export function NotificationsSidebar({ open, onOpenChange }: NotificationsSidebarProps) {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

	const { user } = useUser();
	const { data: tasks } = useGetNotifications(user?.email, {
		enabled: !!user
	});

	// Function to close the sidebar
	const closeSidebar = () => {
		onOpenChange(false);
	};

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange} modal>
				<SheetContent className="w-[400px] bg-white p-0 sm:w-[540px]">
					<SheetHeader className="border-b p-6">
						<SheetTitle>Business process tasks</SheetTitle>
					</SheetHeader>
					<div className="h-full overflow-y-auto pb-20">
						{tasks?.length ? (
							tasks.map((task) => (
								<div key={task.id} className="cursor-pointer border-b p-4">
									<div className="flex items-start gap-3">
										<User className="mt-1 h-5 w-5 text-gray-500" />
										<div className="flex-1">
											<div className="mb-1 flex items-center gap-2">
												<Clock className="h-4 w-4 text-gray-500" />
												<span className="text-sm text-gray-500">
													{format(new Date(task.creationDate), 'yyyy-MM-dd HH:mm')}
												</span>
											</div>
											<div className="text-sm break-all whitespace-pre-line text-[#e89804] hover:underline">
												{/* Pass the closeSidebar function to replaceLinksWithComponent */}
												{replaceLinksWithComponent(task.description, closeSidebar)}
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<i className="mt-4 block p-4">No notifications</i>
						)}
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
