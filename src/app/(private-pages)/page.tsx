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
import Home from './home/page';

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
		<div className="flex min-h-screen w-full flex-1 flex-col">
			<div className="flex flex-1"><Home/></div>
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
