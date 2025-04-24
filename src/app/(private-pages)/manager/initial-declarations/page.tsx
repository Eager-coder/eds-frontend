'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeclarationsTableSkeleton } from './DeclarationsTableSkeleton';
import { cn } from '@/lib/utils';
import { UserDeclarationListItem, useUserInitialDeclarations } from '@/api-client/manager/getUserInitialDeclarations';

function formatDeclId(id: number | undefined): string {
	return id?.toString().padStart(5, '0') ?? 'N/A';
}
// Helper function to determine badge color based on status (keep as is or adjust)
const getStatusBadgeClass = (status: string): string => {
	const lowerStatus = status?.toLowerCase();
	switch (lowerStatus) {
		case 'pending':
		case 'submitted':
		case 'created': // Added CREATED based on new response example
			return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300';
		case 'approved':
		case 'completed':
			return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-300';
		case 'rejected':
			return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-300';
		case 'draft':
			return 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-300';
		default:
			return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300';
	}
};

// Helper to format user names safely
const formatUserName = (
	user: UserDeclarationListItem['user'] | UserDeclarationListItem['responsible'] | null | undefined
): string => {
	if (!user) return 'N/A';
	return `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unnamed User';
};

export default function UserDeclarationsListPage() {
	const router = useRouter();
	const { isLoading: isUserLoading, user } = useUser();

	// Fetch declarations using the updated hook
	const {
		data: declarationsData,
		isLoading: isDeclarationsLoading,
		error: declarationsError
	} = useUserInitialDeclarations({
		queryKey: ['userInitialDeclarationsList'],
		enabled: !isUserLoading && !!user
	});

	const combinedLoading = isUserLoading || isDeclarationsLoading;

	// --- Authentication Check ---
	React.useEffect(() => {
		if (!isUserLoading && !user) {
			router.replace('/login');
		}
	}, [isUserLoading, user, router]);

	// --- Loading State ---
	if (combinedLoading) {
		return (
			<div className="w-full p-6">
				<DeclarationsTableSkeleton />
			</div>
		);
	}

	// --- Ensure user is loaded ---
	if (!user) {
		return null;
	}

	// --- Error State ---
	if (declarationsError) {
		return (
			<div className="p-6 text-center text-red-600">
				<h1 className="text-xl font-semibold">Error Loading Declarations</h1>
				<p>{declarationsError.message || 'An unexpected error occurred.'}</p>
			</div>
		);
	}

	// --- Main Content ---
	return (
		<div className="w-full flex-1 space-y-6 p-6">
			<h1 className="text-2xl font-bold text-zinc-700">Initial Declarations</h1>

			<div className="overflow-hidden border border-zinc-200">
				<Table>
					<TableHeader>
						<TableRow className="border-zinc-200">
							{/* Updated Headers */}
							<TableHead className="w-[120px]">Dec. ID</TableHead>
							<TableHead className="w-[120px]">User</TableHead>
							<TableHead className="w-[150px]">Status</TableHead>
							<TableHead className="w-[180px]">Submitted On</TableHead>
							<TableHead className="w-[200px]">Responsible</TableHead>
							<TableHead className="w-[200px]">Created by</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{declarationsData && declarationsData.length > 0 ? (
							declarationsData.map((declaration) => (
								<TableRow
									className="cursor-pointer text-zinc-700 hover:bg-zinc-100"
									onClick={() => router.push(`/manager/initial-declarations/${declaration.id}`)}
									key={declaration.id}
								>
									{/* Map new data points */}
									<TableCell className="font-medium">
										DEC-{formatDeclId(declaration.declarationId)}
									</TableCell>
									<TableCell className="font-medium">{formatUserName(declaration.user)}</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={cn('capitalize', getStatusBadgeClass(declaration.status))}
										>
											{declaration.status?.toLowerCase() ?? 'Unknown'}
										</Badge>
									</TableCell>
									<TableCell>
										{new Date(declaration.creationDate).toLocaleDateString('en-GB', {
											// Example: UK format
											year: 'numeric',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</TableCell>
									<TableCell>
										{/* Safely access responsible person's name */}
										{formatUserName(declaration.responsible)}
										{/* You could add email or position here too if needed */}
										{/* e.g., <span className="block text-xs text-gray-500">{declaration.responsible?.email}</span> */}
									</TableCell>
									<TableCell className="font-medium">
										{formatUserName(declaration.createdBy)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center text-gray-500">
									No declarations found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
