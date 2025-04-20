'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
	Settings,
	User,
	Truck,
	FileText,
	Plus,
	Filter,
	RotateCcw,
	MoreHorizontal,
	Bell,
	CircleUserRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationsSidebar } from '@/components/notification-sidebar';
import { useUser } from '@/context/UserContext';

export default function Dashboard() {
	const router = useRouter();
	const { user, isLoading } = useUser();
	const [notificationsSidebarOpen, setNotificationsSidebarOpen] = useState(false);
	const { logout } = useUser();

	useEffect(() => {
		// Redirect to login if user is not authenticated and loading is complete
		if (!isLoading && !user) {
			router.push('/login');
		}
	}, [user, isLoading, router]);

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	// If not authenticated and not loading, don't render the dashboard
	if (!user) {
		return null;
	}
	const handleLogout = () => {
		logout();
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				{/* Sidebar */}

				{/* Main content */}
				<main className="flex-1 p-6">
					<div className="mb-6 flex items-center justify-between">
						<h1 className="text-2xl font-bold">Initial declaration</h1>
						<div className="flex gap-3">
							<Button className="bg-amber-500 hover:bg-amber-600">
								<Plus className="mr-2 h-4 w-4" /> Add new
							</Button>
							<Button variant="outline">Import</Button>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Filters */}
					<div className="mb-6 rounded-md border bg-white">
						<div className="flex flex-wrap items-center gap-2 p-2">
							<div className="flex items-center px-2">
								<Filter className="mr-2 h-4 w-4 text-gray-500" />
								<span className="text-sm">Filter By</span>
							</div>

							<div className="flex flex-grow items-center gap-2">
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

							<Button variant="ghost" size="sm" className="flex items-center text-red-500">
								<RotateCcw className="mr-1 h-4 w-4" />
								Reset Filter
							</Button>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-hidden rounded-md border bg-white">
						<table className="w-full">
							<thead className="bg-gray-50 text-left">
								<tr>
									<th className="px-6 py-3 text-sm font-medium text-gray-500">ID</th>
									<th className="px-6 py-3 text-sm font-medium text-gray-500">Created By</th>
									<th className="px-6 py-3 text-sm font-medium text-gray-500">Created On</th>
									<th className="px-6 py-3 text-right text-sm font-medium text-gray-500">STATUS</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{[
									{
										id: '00001',
										createdBy: 'Askar Boranbayev',
										createdOn: '04 Sep 2019',
										status: 'Completed'
									},
									{
										id: '00002',
										createdBy: 'Azat Akash',
										createdOn: '28 May 2019',
										status: 'Processing'
									},
									{
										id: '00003',
										createdBy: 'John Doe',
										createdOn: '23 Nov 2019',
										status: 'Rejected'
									},
									{
										id: '00004',
										createdBy: 'Joe Doe',
										createdOn: '05 Feb 2019',
										status: 'Completed'
									}
								].map((row) => (
									<tr
										key={row.id}
										className="cursor-pointer hover:bg-gray-50"
										onClick={() => router.push(`/declaration/${row.id}`)}
									>
										<td className="px-6 py-4 text-sm">{row.id}</td>
										<td className="px-6 py-4 text-sm">{row.createdBy}</td>
										<td className="px-6 py-4 text-sm">{row.createdOn}</td>
										<td className="px-6 py-4 text-right text-sm">
											<Badge
												className={cn({
													'bg-emerald-100 text-emerald-800 hover:bg-emerald-100':
														row.status === 'Completed',
													'bg-purple-100 text-purple-800 hover:bg-purple-100':
														row.status === 'Processing',
													'bg-red-100 text-red-800 hover:bg-red-100':
														row.status === 'Rejected'
												})}
											>
												{row.status}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="border-t px-6 py-3 text-sm text-gray-500">Showing 1-09 of 78</div>
					</div>
				</main>
			</div>
			<NotificationsSidebar open={notificationsSidebarOpen} onOpenChange={setNotificationsSidebarOpen} />
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
