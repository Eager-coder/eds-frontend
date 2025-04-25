'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAdHocDeclares } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclares';
import { useGetAdHocExcludes } from '@/api-client/user/ad-hoc-declarations/getAdHocExcludes';
import { useUser } from '@/context/UserContext';
import { AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { formatDeclId } from '../manager/initial-declarations/[id]/page';

export default function Page() {
	const router = useRouter();
	const { user, isLoading } = useUser();

	const {
		data: adHocDeclares,
		isPending: isPendingDeclares,
		isError: isErrorDeclares
	} = useGetAdHocDeclares(user?.id);

	const {
		data: adHocExcludes,
		isPending: isPendingExcludes,
		isError: isErrorExcludes
	} = useGetAdHocExcludes(user?.id);

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/login');
		}
	}, [user, isLoading, router]);

	const getStatusBadge = (status: AdHocStatus) => {
		const colors: Record<AdHocStatus, string> = {
			[AdHocStatus.CREATED]: 'bg-blue-100 text-blue-800',
			[AdHocStatus.SENT_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
			[AdHocStatus.ACTUAL_CONFLICT]: 'bg-red-100 text-red-800',
			[AdHocStatus.PERCEIVED_CONFLICT]: 'bg-orange-100 text-orange-800',
			[AdHocStatus.NO_CONFLICT]: 'bg-green-100 text-green-800',
			[AdHocStatus.APPROVED]: 'bg-purple-100 text-purple-800'
		};
		return <span className={`px-2 py-1 text-xs font-medium ${colors[status]}`}>{status.replace(/_/g, ' ')}</span>;
	};

	return (
		<div className="w-full flex-1 space-y-10 p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">My Ad-hoc declarations</h1>
				<Link
					href="/ad-hoc-declarations/create"
					className="flex items-center gap-1 rounded-sm bg-[#DDAF53] px-3 py-1 text-white"
				>
					<Plus size={20} /> Create
				</Link>
			</div>

			{/* Declare Section */}
			<section>
				<h2 className="mb-4 text-xl font-semibold">Ad-hocs to declare</h2>
				{isPendingDeclares && <div className="py-4 text-center">Loading declarations...</div>}
				{isErrorDeclares && <div className="py-4 text-center text-red-500">Error loading declarations</div>}
				{adHocDeclares && adHocDeclares.length > 0 ? (
					<div className="max-h-[600px] overflow-auto border border-zinc-200">
						<Table>
							<TableHeader>
								<TableRow className="bg-zinc-50">
									<TableHead>ID</TableHead>
									<TableHead>Created By</TableHead>
									<TableHead>Created At</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Responsible</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{adHocDeclares.map((decl) => (
									<TableRow
										key={decl.id}
										onClick={() => router.push(`/ad-hoc-declarations/view/${decl.id}`)}
										className="cursor-pointer border-b border-zinc-300 last:border-0 hover:bg-zinc-50"
									>
										<TableCell>{decl.id}</TableCell>
										<TableCell>{`${decl.createdBy.firstname} ${decl.createdBy.lastname}`}</TableCell>
										<TableCell>{format(new Date(decl.createAt), 'dd MMM yyyy')}</TableCell>
										<TableCell>{getStatusBadge(decl.status)}</TableCell>
										<TableCell>
											{decl.responsible
												? `${decl.responsible.firstname} ${decl.responsible.lastname}`
												: '-'}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					!isPendingDeclares && (
						<div className="border border-zinc-200 py-8 text-center">No ad-hoc declarations found</div>
					)
				)}
			</section>

			{/* Exclude Section */}
			<section>
				<h2 className="mb-4 text-xl font-semibold">Ad-hocs to exclude</h2>
				{isPendingExcludes && <div className="py-4 text-center">Loading exclusion declarations...</div>}
				{isErrorExcludes && (
					<div className="py-4 text-center text-red-500">Error loading exclusion declarations</div>
				)}
				{adHocExcludes && adHocExcludes.length > 0 ? (
					<div className="max-h-[400px] overflow-auto border border-zinc-200">
						<Table>
							<TableHeader>
								<TableRow className="bg-zinc-50">
									<TableHead>ID</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Declaration ID</TableHead>
									<TableHead>Reason</TableHead>
									<TableHead>Created At</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{adHocExcludes.map((excl) => {
									const isInitial = Boolean(excl.userInitialDeclaration);
									const declId = isInitial
										? excl.userInitialDeclaration!.id
										: excl.userAdHocDeclare!.id;
									const name = isInitial
										? `DEC-${formatDeclId(declId)}`
										: `AD-HOC-${formatDeclId(declId)}`;
									return (
										<TableRow
											key={excl.id}
											onClick={() => router.push(`/ad-hoc-declarations/view/exclude/${excl.id}`)}
											className="cursor-pointer border-b border-zinc-300 last:border-0 hover:bg-zinc-50"
										>
											<TableCell>{excl.id}</TableCell>
											<TableCell>{isInitial ? 'Initial' : 'Ad-hoc'}</TableCell>
											<TableCell>{name}</TableCell>
											<TableCell>{excl.excludeReason.slice(0, 35)}...</TableCell>
											<TableCell>{format(new Date(excl.createdAt), 'dd MMM yyyy')}</TableCell>
											<TableCell>{getStatusBadge(excl.status)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				) : (
					!isPendingExcludes && (
						<div className="border border-zinc-200 py-8 text-center">No exclusion declarations found</div>
					)
				)}
			</section>
		</div>
	);
}
