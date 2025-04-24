'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserInitialDeclaration } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { useGetManagementActions } from '@/api-client/admin/management-actions/getManagementActions';
import {
	createMangementPlan,
	CreateMangementPlanRequest
} from '@/api-client/manager/management-plans/createManagementPlan';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Stepper, { StepProps } from '@/components/Stepper';
import { formatDeclId, formatDetailedDateTime, formatUserName } from '../../initial-declarations/[id]/page';
import { UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const decIdParam = searchParams.get('decId');
	const decId = decIdParam ? Number(decIdParam) : undefined;
	const adHocParam = searchParams.get('adHocId');
	const adHocId = adHocParam ? Number(adHocParam) : undefined;

	// Authentication
	const { user, isLoading: authLoading } = useUser();

	// Fetch the initial declaration
	const { data: declaration, isLoading: declLoading } = useUserInitialDeclaration({
		userId: decId ?? 0,
		enabled: !!user && !!decId
	});

	// Fetch available management actions
	const { data: managementActions = [], isLoading: actionsLoading } = useGetManagementActions({
		enabled: !!user,
		queryKey: ['managementActions']
	});

	// Form state
	const [actionRequired, setActionRequired] = useState(false);
	const [noActionRequired, setNoActionRequired] = useState(false);
	const [actionId, setActionId] = useState<number | ''>('');
	const [actionDetails, setActionDetails] = useState('');
	const [executionDate, setExecutionDate] = useState('');

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [authLoading, user, router]);

	// Loading & error states
	if (authLoading || declLoading || actionsLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) {
		return null; // already redirected
	}
	if (!declaration) {
		return <div className="p-6 text-center text-red-500">Declaration not found.</div>;
	}

	// Build stepper
	const steps: StepProps[] = [
		{
			name: UIDStatus.CREATED,
			description: 'Created',
			isActive: declaration.status === UIDStatus.CREATED,
			isCompleted: declaration.status !== UIDStatus.CREATED,
			isLast: false
		},
		{
			name: UIDStatus.SENT_FOR_APPROVAL,
			description: 'Sent for approval',
			isActive: declaration.status === UIDStatus.SENT_FOR_APPROVAL,
			isCompleted: declaration.status !== UIDStatus.SENT_FOR_APPROVAL,
			isLast: false
		},
		{
			name: declaration.status.includes('CONFLICT') ? 'CONFLICT' : 'Result',
			description: 'Reviewed',
			isActive: false,
			isCompleted: false,
			isLast: true
		}
	];

	// Handle form submission
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Build the request payload
		const payload: CreateMangementPlanRequest = {
			actionRequired,
			// include exactly one of these
			...(decId ? { userDeclarationId: decId } : {}),
			...(adHocId ? { adHocId } : {}),
			// for the API, actionId and executionDate are required
			actionId: actionRequired ? (actionId as number) : 0,
			executionDate: actionRequired ? new Date(executionDate).toISOString() : new Date().toISOString(),
			...(actionDetails.trim() ? { actionDetails: actionDetails.trim() } : {})
		};

		try {
			const created = await createMangementPlan(payload);
			// redirect to the newly created management plan page
			// router.push(`/manager/management-plans/${created.id}`);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			console.error(err);
			alert(`Failed to create management plan: ${msg}`);
		}
	}

	return (
		<div className="w-full space-y-4 p-4">
			{/* Stepper */}
			<Stepper title="" steps={steps} activeStep={steps.findIndex((s) => s.name === declaration.status)} />

			<div className="flex w-full gap-4">
				{/* Declaration Info */}
				<div className="min-w-max rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
					<div className="grid grid-cols-1 gap-y-5">
						<div>
							<span className="block text-sm text-gray-500">Number</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
								DEC-{formatDeclId(declaration.declarationId)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created by</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-blue-600">
								{formatUserName(declaration.createdBy)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Created on</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
								{formatDetailedDateTime(declaration.creationDate)}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Position/Manager</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
								{declaration.user?.position ?? 'N/A'}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Department/Office/School</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
								{declaration.user?.department ?? 'N/A'}
							</p>
						</div>
						<div>
							<span className="block text-sm text-gray-500">Status</span>
							<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900 capitalize last:border-b-0">
								{declaration.status.toLowerCase()}
							</p>
						</div>
					</div>
				</div>

				{/* Management Plan Form */}
				<div className="w-full space-y-4 border-gray-200 bg-white p-6 shadow-sm">
					<h1 className="text-xl font-semibold">Management Plan</h1>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Action-required toggles */}
						<div className="flex items-center gap-2">
							<Checkbox
								id="action-required"
								checked={actionRequired}
								onCheckedChange={(v) => {
									setActionRequired(!!v);
									if (v) setNoActionRequired(false);
								}}
							/>
							<Label htmlFor="action-required">
								Action is required to eliminate/manage the conflict of interest
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="no-action-required"
								checked={noActionRequired}
								onCheckedChange={(v) => {
									setNoActionRequired(!!v);
									if (v) setActionRequired(false);
								}}
							/>
							<Label htmlFor="no-action-required">No further action required apart from declaring</Label>
						</div>

						{/* Conditional fields */}
						{actionRequired && (
							<div className="space-y-4">
								{/* Select action */}
								<div>
									<Label htmlFor="action-select">Action to be taken *</Label>
									<select
										id="action-select"
										value={actionId}
										onChange={(e) => setActionId(Number(e.target.value))}
										className="mt-1 w-full rounded border px-2 py-1"
										required
									>
										<option value="">Select an action…</option>
										{managementActions.map((a) => (
											<option key={a.id} value={a.id}>
												{a.description.en}
											</option>
										))}
									</select>
								</div>

								{/* Optional details */}
								<div>
									<Label htmlFor="action-details">Action details (optional)</Label>
									<Textarea
										id="action-details"
										value={actionDetails}
										onChange={(e) => setActionDetails(e.target.value)}
										placeholder="Any extra information…"
									/>
								</div>

								{/* Execution date */}
								<div>
									<Label htmlFor="execution-date">
										Execution of this action plan must be confirmed or action plan will be reviewed
										*
									</Label>
									<Input
										id="execution-date"
										type="datetime-local"
										value={executionDate}
										onChange={(e) => setExecutionDate(e.target.value)}
										required
									/>
								</div>

								{/* Note about auto-generated dates */}
								<p className="text-sm text-gray-500">
									Date of notification sent to the applicant and date of confirmation of
									implementation of the plan will be generated automatically.
								</p>
							</div>
						)}

						<Button type="submit" disabled={actionRequired && (!actionId || !executionDate)}>
							Save Management Plan
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
