'use client';

import type React from 'react';
import '../globals.css';
import { FileStack, FileText, FileX2, Truck, User } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, isLoading } = useUser();

	return (
		<>
			<Navbar />
			<div className="flex">
				<Sidebar />

				{isLoading ? (
					<div className="w-full space-y-3 p-6">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
					</div>
				) : (
					children
				)}
			</div>
		</>
	);
}
