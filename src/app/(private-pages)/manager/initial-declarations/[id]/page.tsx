'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import {
	useUserInitialDeclaration,
	UIDResponse
} from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { FormProvider, useForm } from 'react-hook-form';
import { QuestionDisplay } from '@/components/declaration/QuestionDisplay';
import { ViewDeclarationSkeleton } from '@/components/declaration/ViewDeclarationSkeleton';
import { DeclarationAnswersFormValues, declarationAnswersSchema } from '@/schemas/declarationAnswersSchema';
import { Button } from '@/components/ui/button';
import { UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUIDStatus } from '@/api-client/manager/initial-declarations/updateUIDStatus';
import { useGetUIDManagementPlans } from '@/api-client/common/getUIDManagementPlans';
import { Badge } from '@/components/ui/badge';

export function formatDeclId(id: number | undefined): string {
	return id?.toString().padStart(5, '0') ?? 'N/A';
}
export const formatDetailedDateTime = (isoDateString: string | undefined): string => {
	if (!isoDateString) return 'N/A';
	try {
		const date = new Date(isoDateString);
		// Adjust options for desired format
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'numeric', // Use 'numeric' for M/
			day: 'numeric', // Use 'numeric' for D/
			hour: 'numeric',
			minute: 'numeric', // Use 'numeric' for MM
			hour12: true
		};
		return date.toLocaleString('en-US', options).replace(',', ''); // en-US gives M/D/YYYY format, remove comma
	} catch (e) {
		console.error('Error formatting date:', e);
		return 'Invalid Date';
	}
};

// Helper to format user names safely
export const formatUserName = (user: UIDResponse['user'] | null | undefined): string => {
	if (!user) return 'N/A';
	return `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unnamed User';
};

export default function ManagerViewDeclarationPage() {
	const router = useRouter();
	const params = useParams();
	const userId = Number(params.id); // This will be a string or string[]

	const { isLoading: isUserLoading, user: managerUser } = useUser();

	// Fetch data using the manager-specific hook
	const {
		data: declarationData,
		isLoading: isDeclarationLoading,
		refetch
	} = useUserInitialDeclaration({
		userId: userId!,
		enabled: !!userId
	});

	const { data: managementPlans } = useGetUIDManagementPlans(declarationData?.user.id, {
		enabled: Boolean(declarationData?.userDeclarationId)
	});

	const formMethods = useForm<DeclarationAnswersFormValues>({
		defaultValues: { questions: [] }
	});

	const combinedLoading = isUserLoading || (!!userId && isDeclarationLoading);
	console.log(declarationData);
	const handleStatusUpdate = async () => {
		if (declarationData && statusToUpdate) {
			await updateUIDStatus(declarationData.userDeclarationId, statusToUpdate);
			await refetch();
		}
	};

	React.useEffect(() => {
		if (!isUserLoading && !managerUser) {
			router.replace('/login');
		}
	}, [isUserLoading, managerUser, router]);
	const [statusToUpdate, setStatusToUpdate] = useState<UIDStatus | null>(null);

	if (combinedLoading) {
		return <ViewDeclarationSkeleton />;
	}

	if (
		!managerUser ||
		(managerUser.role !== 'MANAGER' && managerUser.role !== 'ADMIN' && managerUser.role !== 'SUPER_ADMIN')
	) {
		return (
			<div className="p-6 text-center text-red-500">
				<h1 className="text-xl font-semibold">Access Denied</h1>
				<p>You do not have permission to view this page.</p>
				<Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
					Go to Dashboard
				</Link>
			</div>
		);
	}

	if (!userId) {
		return (
			<div className="p-6 text-center text-red-500">
				<h1 className="text-xl font-semibold">Invalid User ID</h1>
				<p>The user ID provided in the URL is not valid.</p>
				<Button variant="outline" onClick={() => router.back()} className="mt-4">
					<ArrowLeft className="mr-2 h-4 w-4" /> Go Back
				</Button>
			</div>
		);
	}

	if (!declarationData) {
		return (
			<div className="p-6 text-center text-gray-600">
				<h1 className="text-xl font-semibold">Declaration Not Found</h1>
				<p>No initial declaration data found for the specified user.</p>
				<Button variant="outline" onClick={() => router.back()} className="mt-4">
					<ArrowLeft className="mr-2 h-4 w-4" /> Go Back
				</Button>
			</div>
		);
	}
	const hasConflict =
		declarationData.status === UIDStatus.PERCEIVED_CONFLICT || declarationData.status === UIDStatus.ACTUAL_CONFLICT;

	const sentForApprovalStepColor = () => {
		if (hasConflict) {
			return 'bg-red-500 text-white';
		}
		if (
			declarationData.status === UIDStatus.SENT_FOR_APPROVAL ||
			declarationData.status === UIDStatus.NO_CONFLICT
		) {
			return 'bg-green-500 text-white';
		}
		return 'bg-gray-200 text-black';
	};

	const completedStepColor = () => {
		if (hasConflict) return 'bg-red-500 text-white';

		if (declarationData.status === UIDStatus.NO_CONFLICT) {
			return 'bg-green-500 text-white';
		}

		return 'bg-gray-200 text-black';
	};

	return (
		<FormProvider {...formMethods}>
			<div className="w-full flex-1 space-y-6 p-6">
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.back()}
					className="mb-4 cursor-pointer rounded-sm border-zinc-200"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to User List
				</Button>

				<div className="w-full max-w-5xl border-none bg-zinc-50">
					<div className="flex gap-2">
						<div className="relative flex w-full items-stretch gap-4">
							<div
								className={cn(
									`relative z-10 flex w-full min-w-[200px] flex-col justify-center px-6 py-2`,
									hasConflict ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
								)}
								style={{
									clipPath:
										'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)'
								}}
							>
								<div className={`text-base font-semibold`}>Created</div>
							</div>
							<div
								className={cn(
									`relative z-10 flex w-full min-w-[200px] flex-col justify-center px-6 py-2`,
									sentForApprovalStepColor()
								)}
								style={{
									clipPath:
										'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)'
								}}
							>
								<div className={`text-base font-semibold`}>Sent for Approval</div>
							</div>
							<div
								className={cn(
									`relative z-10 flex w-full min-w-[200px] flex-col justify-center px-6 py-2`,
									completedStepColor()
								)}
								style={{
									clipPath:
										'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)'
								}}
							>
								<div className={`text-base font-semibold`}>
									{hasConflict ? 'Conflict' : 'No Conflict'}
								</div>
							</div>
						</div>
					</div>
				</div>
				{declarationData.status === UIDStatus.NO_CONFLICT ||
				declarationData.status === UIDStatus.ACTUAL_CONFLICT ||
				declarationData.status === UIDStatus.PERCEIVED_CONFLICT ? (
					<Button
						type="button"
						className="flex w-max cursor-pointer items-center justify-center gap-2 rounded bg-[#DDAF53] px-3 py-2 text-white hover:bg-amber-600"
					>
						<Download /> Export PDF
					</Button>
				) : null}
				{hasConflict && !managementPlans?.length && (
					<div className="space-y-3 rounded-sm border border-zinc-200 p-4">
						<h2>Next steps:</h2>
						<Link
							href={`/manager/management-plans/create?decId=${declarationData.user.id}`}
							className="rounded-sm bg-[#DDAF53] px-3 py-2 text-white hover:bg-amber-700"
						>
							Create management plan
						</Link>
					</div>
				)}

				{managementPlans?.length ? (
					<div className="rounded-sm border border-zinc-200 p-4">
						<h3>Management plans:</h3>
						{managementPlans?.map((mp, index) => (
							<ol key={mp.id} className="my-2">
								<Link
									href={`/manager/management-plans/view/${mp.id}`}
									className="flex gap-2 font-semibold text-amber-700 hover:underline"
								>
									<span>Management plan MP-{formatDeclId(mp.id)}</span>

									<Badge className="bg-gray-700 text-white">{mp.status.toLocaleLowerCase()}</Badge>
								</Link>
							</ol>
						))}
					</div>
				) : null}

				<div className="flex min-h-[400px] flex-1 gap-4">
					<div className="min-w-max rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
						<div className="grid grid-cols-1 gap-y-5">
							<div>
								<span className="block text-sm text-gray-500">Number</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									DEC-{formatDeclId(declarationData?.userDeclarationId)}
								</p>
							</div>

							<div>
								<span className="block text-sm text-gray-500">Created by</span>

								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-blue-600">
									{formatUserName(declarationData?.createdBy)}
								</p>
							</div>

							<div>
								<span className="block text-sm text-gray-500">Created on</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{formatDetailedDateTime(declarationData?.creationDate)}
								</p>
							</div>

							<div>
								<span className="block text-sm text-gray-500">Position/Manager</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{declarationData?.user?.position || 'N/A'}
								</p>
							</div>

							<div>
								<span className="block text-sm text-gray-500">Department/Office/School</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{declarationData?.user?.department || 'N/A'}
								</p>
							</div>

							<div>
								<span className="block text-sm text-gray-500">Status</span>

								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900 capitalize last:border-b-0">
									{declarationData?.status?.toLowerCase() ?? 'N/A'}
								</p>
							</div>
						</div>
					</div>
					<div className="min-w-[300px] flex-1 overflow-auto rounded-sm border border-gray-200 p-4 shadow-sm">
						{/* Map through questions and render the display component in read-only mode */}
						{declarationData.questionsWithAnswers.map((question, index) => (
							<QuestionDisplay
								key={question.id}
								question={question}
								questionIndex={index}
								isReadOnly={true} // <-- Set to read-only
							/>
						))}

						{declarationData.status === UIDStatus.SENT_FOR_APPROVAL ? (
							<div className="mt-3 bg-amber-50 p-4">
								<h2 className="mb-2 flex gap-2 text-xl font-semibold">
									<AlertCircle className="text-orange-500" strokeWidth={3} />
									Action Required: Select status
								</h2>
								<Select
									value={statusToUpdate || ''}
									onValueChange={(val: UIDStatus) => setStatusToUpdate(val)}
								>
									<SelectTrigger id="" className="w-72 rounded-sm border border-zinc-300 bg-white">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent className="border border-zinc-300 bg-white">
										{[
											UIDStatus.NO_CONFLICT,
											UIDStatus.PERCEIVED_CONFLICT,
											UIDStatus.ACTUAL_CONFLICT
										].map((type) => (
											<SelectItem key={type} value={type}>
												{type.replace(/_/g, ' ').toLowerCase()}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									onClick={handleStatusUpdate}
									type="submit"
									disabled={!statusToUpdate}
									className="mt-4 w-24 bg-[#DDAF53] text-white hover:bg-amber-600"
								>
									Save
								</Button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
