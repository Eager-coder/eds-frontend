'use client';

import { useGetAdHocDeclares } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclares';
import { useUser } from '@/context/UserContext';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { format } from 'date-fns';
import { AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';

export default function Page() {
	const router = useRouter();
	const { user, isLoading } = useUser();

	const { data: adHocDeclares, isPending, isError } = useGetAdHocDeclares(user?.id);

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/login');
		}
	}, [user, isLoading, router]);

	// Function to get a status badge with appropriate color
	const getStatusBadge = (status: AdHocStatus) => {
		const statusColors = {
			[AdHocStatus.CREATED]: 'bg-blue-100 text-blue-800',
			[AdHocStatus.SENT_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
			[AdHocStatus.ACTUAL_CONFLICT]: 'bg-red-100 text-red-800',
			[AdHocStatus.PERCEIVED_CONFLICT]: 'bg-orange-100 text-orange-800',
			[AdHocStatus.NO_CONFLICT]: 'bg-green-100 text-green-800',
			[AdHocStatus.APPROVED]: 'bg-purple-100 text-purple-800'
		};

		return (
			<span className={`px-2 py-1 text-xs font-medium ${statusColors[status]}`}>{status.replace(/_/g, ' ')}</span>
		);
	};

	return (
		<div className="w-full flex-1 p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Ad-hoc declaration</h1>
				<Link
					className="flex w-max items-center gap-1 rounded-sm bg-[#DDAF53] px-3 py-1 text-white"
					href="/ad-hoc-declarations/create"
				>
					<Plus width={20} height={20} strokeWidth={3} />
					Create
				</Link>
			</div>

			<div>
				<h2 className="mb-4 text-xl font-semibold">Ad-hocs to declare</h2>

				{/* Loading and error states */}
				{isPending && <div className="py-4 text-center">Loading declarations...</div>}
				{isError && <div className="py-4 text-center text-red-500">Error loading declarations</div>}

				{/* Table with max height and scrolling */}
				{adHocDeclares && adHocDeclares.length > 0 ? (
					<div className="max-h-[600px] overflow-auto border border-zinc-200">
						<Table>
							<TableHeader>
								<TableRow className="bg-zinc-50">
									<TableHead className="border-b border-zinc-200 font-semibold">ID</TableHead>
									<TableHead className="border-b border-zinc-200 font-semibold">Created By</TableHead>
									<TableHead className="border-b border-zinc-200 font-semibold">Created At</TableHead>
									<TableHead className="border-b border-zinc-200 font-semibold">Status</TableHead>
									<TableHead className="border-b border-zinc-200 font-semibold">
										Responsible
									</TableHead>
									<TableHead className="border-b border-zinc-200 font-semibold">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{adHocDeclares.map((declaration) => (
									<TableRow
										key={declaration.id}
										className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50"
									>
										<TableCell className="border-r border-zinc-200">{declaration.id}</TableCell>
										<TableCell className="border-r border-zinc-200">
											{`${declaration.createdBy.firstname} ${declaration.createdBy.lastname}`}
										</TableCell>
										<TableCell className="border-r border-zinc-200">
											{format(new Date(declaration.createAt), 'dd MMM yyyy')}
										</TableCell>
										<TableCell className="border-r border-zinc-200">
											{getStatusBadge(declaration.status)}
										</TableCell>
										<TableCell className="border-r border-zinc-200">
											{declaration.responsible
												? `${declaration.responsible.firstname} ${declaration.responsible.lastname}`
												: '-'}
										</TableCell>
										<TableCell>
											<Link
												href={`/ad-hoc-declarations/view/${declaration.id}`}
												className="text-blue-600 hover:underline"
											>
												View
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					!isPending && (
						<div className="border border-zinc-200 py-8 text-center">No ad-hoc declarations found</div>
					)
				)}
			</div>
		</div>
	);
}
