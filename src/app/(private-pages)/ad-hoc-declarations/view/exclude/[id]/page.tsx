'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useGetAdHocExclude } from '@/api-client/user/ad-hoc-declarations/getAdHocExclide';
import { ChevronLeft } from 'lucide-react';
import { formatDeclId } from '@/app/(private-pages)/manager/initial-declarations/[id]/page';

export default function AdHocExcludeViewPage() {
	const router = useRouter();
	const { user, isLoading: userLoading } = useUser();
	const params = useParams();
	const id = Number(params.id);

	const { data: exclude, isPending, isError } = useGetAdHocExclude(id);

	useEffect(() => {
		if (!user && !userLoading) {
			router.replace('/login');
		}
	}, [user, userLoading, router]);

	if (isPending || userLoading) {
		return <div className="p-6 text-center">Loading...</div>;
	}

	if (isError || !exclude) {
		return <div className="p-6 text-center text-red-500">Error loading exclusion declaration.</div>;
	}

	const getStatusBadge = (status: typeof exclude.status) => {
		const colors: Record<typeof exclude.status, string> = {
			CREATED: 'bg-blue-100 text-blue-800',
			SENT_FOR_APPROVAL: 'bg-yellow-100 text-yellow-800',
			ACTUAL_CONFLICT: 'bg-red-100 text-red-800',
			PERCEIVED_CONFLICT: 'bg-orange-100 text-orange-800',
			NO_CONFLICT: 'bg-green-100 text-green-800',
			APPROVED: 'bg-purple-100 text-purple-800'
		};
		return <Badge className={`px-2 py-1 ${colors[status]}`}>{status.replace(/_/g, ' ')}</Badge>;
	};

	const isInitial = Boolean(exclude.userInitialDeclaration);
	const declId = isInitial ? exclude.userInitialDeclaration!.declarationId : exclude.userAdHocDeclare!.id;
	const declName = isInitial ? exclude.userInitialDeclaration!.declarationTitle : `Ad-hoc #${declId}`;

	return (
		<div className="w-full flex-1 space-y-6 p-6">
			<Link href="/ad-hoc-declarations" className="mb-4 flex gap-2 text-[#DDAF53] hover:underline">
				<ChevronLeft width={24} height={24} />
				<span>Back to exclusions</span>
			</Link>

			<h1 className="text-2xl font-semibold">Exclusion Declaration #{exclude.id}</h1>

			<div className="border border-zinc-200 p-4">
				<div className="grid grid-cols-[200px_1fr] gap-x-6 gap-y-4">
					<Label>ID:</Label>
					<span>{exclude.id}</span>

					<Label>Type:</Label>
					<span>{isInitial ? 'Initial' : 'Ad-hoc'}</span>

					<Label>Declaration ID:</Label>
					<span>
						{isInitial
							? `DEC-${formatDeclId(exclude.userInitialDeclaration?.id)}`
							: `AD-HOC-${formatDeclId(exclude.userInitialDeclaration?.id)}`}
					</span>

					<Label>Original Declaration:</Label>
					<span>{declName}</span>

					<Label>Reason:</Label>
					<span>{exclude.excludeReason}</span>

					<Label>Created At:</Label>
					<span>{format(new Date(exclude.createdAt), 'dd MMM yyyy, HH:mm')}</span>

					<Label>Status:</Label>
					<span>{getStatusBadge(exclude.status)}</span>

					<Label>Confirmed:</Label>
					<span>{exclude.isConfirmed ? 'Yes' : 'No'}</span>

					<Label>User:</Label>
					<span>{`${exclude.user.firstname} ${exclude.user.lastname} (${exclude.user.email})`}</span>

					<Label>Created By:</Label>
					<span>{`${exclude.createdBy.firstname} ${exclude.createdBy.lastname} (${exclude.createdBy.email})`}</span>

					<Label>Responsible:</Label>
					<span>
						{exclude.responsible ? `${exclude.responsible.firstname} ${exclude.responsible.lastname}` : '-'}
					</span>
				</div>
			</div>
		</div>
	);
}
