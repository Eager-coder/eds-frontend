'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { useGetAdHocExclude } from '@/api-client/user/ad-hoc-declarations/getAdHocExclide';
import { updateAdHocExclude } from '@/api-client/manager/ad-hoc-declarations/updateAdHocExclude';
import { formatDeclId } from '../../../initial-declarations/[id]/page';

export default function AdHocExcludeManagerPage() {
	const router = useRouter();
	const params = useParams();
	const id = Number(params.id);
	const { user, isLoading: userLoading } = useUser();
	const queryClient = useQueryClient();

	const { data: exclude, isPending, isError } = useGetAdHocExclude(id);

	const [selectedStatus, setSelectedStatus] = useState<AdHocStatus | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const updateMutation = useMutation({
		mutationFn: ({ id, status }: { id: number; status: AdHocStatus }) =>
			updateAdHocExclude(id, {
				isConfirmed: true,
				status
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adHocExclude', id] });
			setDialogOpen(false);
		}
	});

	useEffect(() => {
		if (!user && !userLoading) {
			router.replace('/login');
		}
	}, [user, userLoading, router]);

	if (isPending || userLoading) {
		return <div className="p-6 text-center">Loading exclusion declaration...</div>;
	}

	if (isError || !exclude) {
		return <div className="p-6 text-center text-red-500">Error loading exclusion declaration.</div>;
	}

	const canManage = user && (user.role === 'MANAGER' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

	const currentVisualStep =
		exclude.status === AdHocStatus.CREATED ? 0 : exclude.status === AdHocStatus.SENT_FOR_APPROVAL ? 1 : 2;
	const hasConflict = [AdHocStatus.ACTUAL_CONFLICT, AdHocStatus.PERCEIVED_CONFLICT].includes(exclude.status);

	const getStatusBadge = (status: AdHocStatus) => {
		const colors: Record<AdHocStatus, string> = {
			[AdHocStatus.CREATED]: 'bg-blue-100 text-blue-800',
			[AdHocStatus.SENT_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800',
			[AdHocStatus.ACTUAL_CONFLICT]: 'bg-red-100 text-red-800',
			[AdHocStatus.PERCEIVED_CONFLICT]: 'bg-orange-100 text-orange-800',
			[AdHocStatus.NO_CONFLICT]: 'bg-green-100 text-green-800',
			[AdHocStatus.APPROVED]: 'bg-purple-100 text-purple-800'
		};
		return <Badge className={`px-2 py-1 ${colors[status]}`}>{status.replace(/_/g, ' ')}</Badge>;
	};

	return (
		<div className="w-full flex-1 space-y-6 p-6">
			<Link
				href="/manager/ad-hoc-declarations/"
				className="inline-flex items-center text-[#DDAF53] hover:underline"
			>
				<ArrowLeft size={16} className="mr-2" /> Back to exclusions
			</Link>

			<h1 className="text-2xl font-semibold">Manage Exclusion #{exclude.id}</h1>
			<div className="flex items-center space-x-4">{getStatusBadge(exclude.status)}</div>

			<Card className="w-full rounded border-zinc-200">
				<CardHeader>
					<CardTitle>Exclusion Details</CardTitle>
					<CardDescription>General info</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label>ID</Label>
						<p>{exclude.id}</p>
					</div>
					<div>
						<Label>Declaration ID</Label>
						<p>
							{exclude.userInitialDeclaration
								? `DEC-${formatDeclId(exclude.userInitialDeclaration.id)}`
								: `DEC-${formatDeclId(exclude.userAdHocDeclare?.id)}`}
						</p>
					</div>
					<div>
						<Label>Reason</Label>
						<p>{exclude.excludeReason}</p>
					</div>
					<div>
						<Label>Created At</Label>
						<p>{format(new Date(exclude.createdAt), 'dd MMM yyyy, HH:mm')}</p>
					</div>
					<div>
						<Label>User</Label>
						<p>{`${exclude.user.firstname} ${exclude.user.lastname}`}</p>
					</div>
					<div>
						<Label>Created By</Label>
						<p>{`${exclude.createdBy.firstname} ${exclude.createdBy.lastname}`}</p>
					</div>
					<div>
						<Label>Responsible</Label>
						<p>
							{exclude.responsible
								? `${exclude.responsible.firstname} ${exclude.responsible.lastname}`
								: '-'}
						</p>
					</div>
				</CardContent>
			</Card>

			{canManage && exclude.status === AdHocStatus.SENT_FOR_APPROVAL && (
				<Card className="w-full rounded border-zinc-200">
					<CardHeader>
						<CardTitle>Manager Actions</CardTitle>
						<CardDescription>Update exclusion status</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p>Select status:</p>
							<Select onValueChange={(v: AdHocStatus) => setSelectedStatus(v)}>
								<SelectTrigger className="w-64 border-zinc-200">
									<SelectValue placeholder="Choose status" />
								</SelectTrigger>
								<SelectContent className="border-zinc-200">
									<SelectItem value={AdHocStatus.ACTUAL_CONFLICT}>Actual Conflict</SelectItem>
									<SelectItem value={AdHocStatus.PERCEIVED_CONFLICT}>Perceived Conflict</SelectItem>
									<SelectItem value={AdHocStatus.NO_CONFLICT}>No Conflict</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							className="min-w-3xs rounded-sm bg-[#DDAF53] text-white hover:bg-amber-600"
							onClick={() => setDialogOpen(true)}
							disabled={!selectedStatus}
						>
							Save
						</Button>
					</CardFooter>
				</Card>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Status Update</DialogTitle>
					</DialogHeader>
					<p className="p-4">
						Change status to <strong>{selectedStatus?.replace(/_/g, ' ')}</strong>?
					</p>
					<DialogFooter>
						<Button
							className="bg-[#DDAF53] text-white hover:bg-amber-600"
							onClick={() => selectedStatus && updateMutation.mutate({ id, status: selectedStatus })}
							disabled={updateMutation.isPending}
						>
							Confirm
						</Button>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
