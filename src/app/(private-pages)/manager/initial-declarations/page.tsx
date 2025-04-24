'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { UserDeclarationListItem, useUserInitialDeclarations } from '@/api-client/manager/getUserInitialDeclarations';

function formatDeclId(id: number | undefined): string {
	return id?.toString().padStart(5, '0') ?? 'N/A';
}

function getStatusBadgeClass(status: string): string {
	const lower = status.toLowerCase();
	switch (lower) {
		case 'pending':
		case 'submitted':
		case 'created':
			return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
		case 'approved':
		case 'completed':
			return 'bg-green-100 text-green-800 border border-green-300';
		case 'rejected':
			return 'bg-red-100 text-red-800 border border-red-300';
		case 'draft':
			return 'bg-gray-100 text-gray-800 border border-gray-300';
		default:
			return 'bg-blue-100 text-blue-800 border border-blue-300';
	}
}

function formatUserName(u?: UserDeclarationListItem['user'] | UserDeclarationListItem['responsible']): string {
	if (!u) return 'N/A';
	const name = `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim();
	return name || 'Unnamed User';
}

export default function UserDeclarationsListPage() {
	const router = useRouter();
	const { user, isLoading: userLoading } = useUser();

	const {
		data: declarationsData,
		isLoading: declLoading,
		error: declError
	} = useUserInitialDeclarations({
		queryKey: ['userInitialDeclarationsList'],
		enabled: !userLoading && !!user
	});

	const loading = userLoading || declLoading;

	React.useEffect(() => {
		if (!userLoading && !user) {
			router.replace('/login');
		}
	}, [userLoading, user, router]);

	if (loading) {
		return (
			<div className="w-full p-6">
				<p>Loading declarations…</p>
			</div>
		);
	}

	if (!user) return null;

	if (declError) {
		return (
			<div className="p-6 text-center text-red-600">
				<h2 className="text-xl font-semibold">Error Loading Declarations</h2>
				<p>{declError.message || 'An unexpected error occurred.'}</p>
			</div>
		);
	}

	return (
		<div className="w-full flex-1 space-y-6 p-6">
			<h1 className="text-2xl font-bold text-zinc-700">Initial Declarations</h1>

			<div className="overflow-auto border border-zinc-200">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="bg-zinc-50">
							<th className="w-[120px] border-b border-zinc-200 px-4 py-2">Dec. ID</th>
							<th className="w-[120px] border-b border-zinc-200 px-4 py-2">User</th>
							<th className="w-[150px] border-b border-zinc-200 px-4 py-2">Status</th>
							<th className="w-[180px] border-b border-zinc-200 px-4 py-2">Submitted On</th>
							<th className="w-[200px] border-b border-zinc-200 px-4 py-2">Responsible</th>
							<th className="w-[200px] border-b border-zinc-200 px-4 py-2">Created by</th>
						</tr>
					</thead>
					<tbody>
						{declarationsData && declarationsData.length > 0 ? (
							declarationsData.map((decl) => (
								<tr
									key={decl.id}
									className="cursor-pointer text-zinc-700 hover:bg-zinc-100"
									onClick={() => router.push(`/manager/initial-declarations/${decl.id}`)}
								>
									<td className="border-b border-zinc-200 px-4 py-3 font-medium">
										DEC-{formatDeclId(decl.declarationId)}
									</td>
									<td className="border-b border-zinc-200 px-4 py-3 font-medium">
										{formatUserName(decl.user)}
									</td>
									<td className="border-b border-zinc-200 px-4 py-3">
										<span
											className={`inline-block px-2 py-1 text-xs font-medium capitalize ${getStatusBadgeClass(
												decl.status
											)}`}
										>
											{decl.status.toLowerCase()}
										</span>
									</td>
									<td className="border-b border-zinc-200 px-4 py-3">
										{new Date(decl.creationDate).toLocaleDateString('en-GB', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</td>
									<td className="border-b border-zinc-200 px-4 py-3">
										{formatUserName(decl.responsible)}
									</td>
									<td className="border-b border-zinc-200 px-4 py-3 font-medium">
										{formatUserName(decl.createdBy)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="h-24 text-center text-gray-500">
									No declarations found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
