'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useGetManagementActions } from '@/api-client/admin/management-actions/getManagementActions';
import { useManagementPlanById } from '@/api-client/manager/management-plans/getManagementPlanById';
import { ManagementPlanStatus } from '@/api-client/manager/management-plans/getManagementPlanById';
import Stepper, { StepProps } from '@/components/Stepper';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { formatDeclId, formatDetailedDateTime, formatUserName } from '../../manager/initial-declarations/[id]/page';
import { answerUserManagementPlan } from '@/api-client/user/management-plan/answerUserManagementPlan';

export default function Page() {
	const router = useRouter();
	const { id } = useParams();
	const planId = Number(id);

	// auth
	const { user, isLoading: authLoading } = useUser();

	// fetch actions (for lookup) & plan
	const { data: managementActions = [], isLoading: actionsLoading } = useGetManagementActions({
		enabled: !!user,
		queryKey: ['managementActions']
	});
	const { data: plan, isLoading: planLoading, refetch } = useManagementPlanById(planId);
	// state for user's response
	const [choice, setChoice] = useState<boolean | null>(null);
	const [reason, setReason] = useState('');
	const [submitting, setSubmitting] = useState(false);
	// redirect if not logged in
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [authLoading, user, router]);

	if (!plan) {
		return <div className="p-6 text-center text-red-500">Management plan not found.</div>;
	}
	// stepper
	const steps: StepProps[] = [
		{
			name: ManagementPlanStatus.CREATED,
			description: 'Created',
			isActive: plan.status === ManagementPlanStatus.CREATED,
			isCompleted: plan.status !== ManagementPlanStatus.CREATED,
			isLast: false
		},
		{
			name: ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			description: 'Sent for confirmation',
			isActive: plan.status === ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			isCompleted: plan.status !== ManagementPlanStatus.SENT_FOR_CONFIRMATION,
			isLast: false
		},
		{
			name: plan.status,
			description: 'Finalized',
			isActive: plan.status === ManagementPlanStatus.AGREED || plan.status === ManagementPlanStatus.REFUSED,
			isCompleted: plan.status !== ManagementPlanStatus.AGREED && plan.status !== ManagementPlanStatus.REFUSED,
			isLast: true
		}
	];

	// lookup selected action
	const selectedAction = managementActions.find((a) => a.id === plan.actionId);

	// submit handler
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (choice === null) return;
		if (choice === false && reason.trim() === '') {
			alert('Please enter a reason for disagreement.');
			return;
		}

		setSubmitting(true);
		try {
			await answerUserManagementPlan(planId, {
				acknowledgedByUser: choice,
				reasonNonExecution: choice ? null : reason.trim()
			});

			refetch();
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			console.error(err);
			alert(`Failed to submit response: ${msg}`);
		} finally {
			setSubmitting(false);
		}
	}
	// loading / missing
	if (authLoading || actionsLoading || planLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) return null;
	if (!plan) {
		return <div className="p-6 text-center text-red-500">Management plan not found.</div>;
	}

	return (
		<div className="w-full space-y-6 p-4">
			{/* Stepper */}
			<Stepper title="" steps={steps} activeStep={steps.findIndex((s) => s.name === plan.status)} />

			<div className="flex w-full gap-6">
				{/* Left metadata panel */}
				<div className="min-w-max rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
					<div className="grid grid-cols-1 gap-y-5">
						<div>
							<span className="block text-sm text-gray-500">Declaration</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900">
								DEC-{formatDeclId(plan.userDeclarationId || plan.adHocId)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created by</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-blue-600">
								{formatUserName(plan.createdBy)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created on</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900">
								{formatDetailedDateTime(plan.creationDate)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Status</span>
							<p className="mt-1 border-b border-zinc-200 pb-2 text-base font-semibold text-gray-900 capitalize last:border-b-0">
								{plan.status.toLowerCase()}
							</p>
						</div>
					</div>
				</div>

				{/* Right details panel */}
				<div className="flex-1 space-y-6 border border-zinc-200 bg-white p-6 shadow-sm">
					<h1 className="text-xl font-semibold">Management Plan Details</h1>

					{/* Always show these */}
					<div className="space-y-4">
						<div>
							<span className="block text-sm text-gray-500">Action required</span>
							<p className="mt-1 text-gray-900">{plan.actionRequired ? 'Yes' : 'No'}</p>
						</div>

						{plan.actionRequired && (
							<>
								<div>
									<span className="block text-sm text-gray-500">Action to be taken</span>
									<p className="mt-1 text-gray-900">{selectedAction?.description.en ?? '—'}</p>
								</div>
								<div>
									<span className="block text-sm text-gray-500">Action details</span>
									<p className="mt-1 text-gray-900">{plan.actionDetails || '—'}</p>
								</div>
								<div>
									<span className="block text-sm text-gray-500">Execution date</span>
									<p className="mt-1 text-gray-900">{formatDetailedDateTime(plan.executionDate)}</p>
								</div>
							</>
						)}

						<div>
							<span className="block text-sm text-gray-500">Notification date</span>
							<p className="mt-1 text-gray-900">{formatDetailedDateTime(plan.notificationDate)}</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Confirmation date</span>
							<p className="mt-1 text-gray-900">{formatDetailedDateTime(plan.confirmationDate)}</p>
						</div>
					</div>

					{/* If awaiting user confirmation, show form */}
					{plan.status === ManagementPlanStatus.SENT_FOR_CONFIRMATION ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="flex items-center gap-4">
								<label className="inline-flex items-center">
									<input
										type="radio"
										name="response"
										checked={choice === true}
										onChange={() => setChoice(true)}
										className="h-4 w-4"
									/>
									<span className="ml-2">Agree</span>
								</label>
								<label className="inline-flex items-center">
									<input
										type="radio"
										name="response"
										checked={choice === false}
										onChange={() => setChoice(false)}
										className="h-4 w-4"
									/>
									<span className="ml-2">Disagree</span>
								</label>
							</div>

							{choice === false && (
								<div>
									<Label htmlFor="reason">Reason for disagreement</Label>
									<Textarea
										id="reason"
										value={reason}
										onChange={(e) => setReason(e.target.value)}
										placeholder="Enter reason…"
									/>
								</div>
							)}

							<Button
								type="submit"
								disabled={submitting || choice === null || (choice === false && !reason.trim())}
							>
								{submitting ? 'Submitting…' : 'Submit Response'}
							</Button>
						</form>
					) : (
						// view-only after confirmation
						<div className="space-y-4">
							<div>
								<span className="block text-sm text-gray-500">User agreed</span>
								<p className="mt-1 text-gray-900">{plan.acknowledgedByUser ? 'Yes' : 'No'}</p>
							</div>
							{!plan.acknowledgedByUser && (
								<div>
									<span className="block text-sm text-gray-500">Disagreement reason</span>
									<p className="mt-1 text-gray-900">{plan.reasonNonExecution || '—'}</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
