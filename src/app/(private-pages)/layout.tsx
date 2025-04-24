'use client';

import type React from 'react';
import '../globals.css';
import { FileStack, FileText, FileX2, Truck, User } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

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
				{children}
			</div>
		</>
	);
}
