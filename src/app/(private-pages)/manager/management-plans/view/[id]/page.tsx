'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useGetManagementActions } from '@/api-client/admin/management-actions/getManagementActions';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Stepper, { StepProps } from '@/components/Stepper';
import { formatDetailedDateTime, formatUserName } from '../../../initial-declarations/[id]/page';
import {
	ManagementPlanStatus,
	useManagementPlanById
} from '@/api-client/manager/management-plans/getManagementPlanById';

export default function Page() {
	const router = useRouter();
	const { id } = useParams();
	const planId = Number(id);

	// auth
	const { user, isLoading: authLoading } = useUser();

	// fetch actions & plan
	const { data: managementActions = [], isLoading: actionsLoading } = useGetManagementActions({
		enabled: !!user,
		queryKey: ['managementActions']
	});
	const { data: managementPlan, isLoading: planLoading } = useManagementPlanById(planId);

	// redirect if not logged in
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [authLoading, user, router]);

	if (authLoading || actionsLoading || planLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) return null;
	if (!managementPlan) {
		return <div className="p-6 text-center text-red-500">Management plan not found.</div>;
	}

	const steps: StepProps[] = [
		{
			name: ManagementPlanStatus.CREATED,
			description: 'Created',
			isActive: managementPlan.status === ManagementPlanStatus.CREATED,
			isCompleted: managementPlan.status !== ManagementPlanStatus.CREATED,
			isLast: false
		},
		{
			name: ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			description: 'Sent for confirmation',
			isActive: managementPlan.status === ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			isCompleted: managementPlan.status !== ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			isLast: false
		},
		{
			name: managementPlan.status,
			description: 'Finalized',
			isActive:
				managementPlan.status === ManagementPlanStatus.AGREED ||
				managementPlan.status === ManagementPlanStatus.REFUSED,
			isCompleted:
				managementPlan.status !== ManagementPlanStatus.AGREED &&
				managementPlan.status !== ManagementPlanStatus.REFUSED,
			isLast: true
		}
	];

	const selectedAction = managementActions.find((a) => a.id === managementPlan.actionId);

	return (
		<div className="w-full space-y-6 p-4">
			<Stepper title="" steps={steps} activeStep={steps.findIndex((s) => s.name === managementPlan.status)} />

			<div className="flex w-full gap-6">
				{/* Plan Info */}
				<div className="min-w-max rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
					<div className="grid grid-cols-1 gap-y-5">
						<div>
							<span className="block text-sm text-gray-500">Plan ID</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900">
								{managementPlan.id}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created by</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-blue-600">
								{formatUserName(managementPlan.createdBy)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created on</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900">
								{formatDetailedDateTime(managementPlan.creationDate)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Status</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900 capitalize last:border-b-0">
								{managementPlan.status.toLowerCase()}
							</p>
						</div>
					</div>
				</div>

				{/* Plan Details */}
				<div className="flex-1 space-y-6 border border-zinc-200 bg-white p-6 shadow-sm">
					<h1 className="text-xl font-semibold">Management Plan Details</h1>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Checkbox checked={managementPlan.actionRequired} disabled />
							<Label>Action is required to eliminate/manage the conflict of interest</Label>
						</div>
						<div className="flex items-center gap-3">
							<Checkbox checked={!managementPlan.actionRequired} disabled />
							<Label>No further action required apart from declaring</Label>
						</div>

						{managementPlan.actionRequired && (
							<>
								<div>
									<span className="block text-sm text-gray-500">Action to be taken</span>
									<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
										{selectedAction ? selectedAction.description.en : '—'}
									</p>
								</div>

								<div>
									<span className="block text-sm text-gray-500">Action details</span>
									<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
										{managementPlan.actionDetails || '—'}
									</p>
								</div>

								<div>
									<span className="block text-sm text-gray-500">Execution date</span>
									<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
										{formatDetailedDateTime(managementPlan.executionDate)}
									</p>
								</div>
							</>
						)}

						<div>
							<span className="block text-sm text-gray-500">Notification date</span>
							<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
								{managementPlan.notificationDate
									? formatDetailedDateTime(managementPlan.notificationDate)
									: '-'}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Confirmation date</span>
							<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
								{managementPlan.confirmationDate
									? formatDetailedDateTime(managementPlan.confirmationDate)
									: '-'}
							</p>
						</div>

						<div>
							<span className="block text-sm text-gray-500">Reason for non‑execution</span>
							<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
								{managementPlan.reasonNonExecution || '—'}
							</p>
						</div>

						<div className="flex items-center gap-3">
							<Checkbox checked={managementPlan.acknowledgedByUser || false} disabled />
							<Label>Acknowledged by user</Label>
						</div>
						<div className="flex items-center gap-3">
							<Checkbox checked={managementPlan.ensuredByManager} disabled />
							<Label>Ensured by manager</Label>
						</div>

						<div>
							<span className="block text-sm text-gray-500">User disagreement reason</span>
							<p className="mt-1 rounded border border-zinc-200 bg-zinc-50 p-2 text-gray-700">
								{managementPlan.userDisagreementReason || '—'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
