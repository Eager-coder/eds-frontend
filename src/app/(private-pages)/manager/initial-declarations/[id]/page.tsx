'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
import Stepper, { StepProps } from '@/components/Stepper';
import { UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';

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
	const targetUserIdParam = params.id; // This will be a string or string[]

	// Ensure targetUserId is a valid number
	const targetUserId = React.useMemo(() => {
		const id = Array.isArray(targetUserIdParam) ? targetUserIdParam[0] : targetUserIdParam;
		const numId = Number(id);
		return !isNaN(numId) && numId > 0 ? numId : null;
	}, [targetUserIdParam]);

	const { isLoading: isUserLoading, user: managerUser } = useUser();

	// Fetch data using the manager-specific hook
	const { data: declarationData, isLoading: isDeclarationLoading } = useUserInitialDeclaration({
		userId: targetUserId!,
		enabled:
			!isUserLoading &&
			!!managerUser &&
			(managerUser.role === 'MANAGER' || managerUser.role === 'ADMIN' || managerUser.role === 'SUPER_ADMIN') &&
			!!targetUserId
	});

	const formMethods = useForm<DeclarationAnswersFormValues>({
		defaultValues: { questions: [] }
	});

	const combinedLoading = isUserLoading || (!!targetUserId && isDeclarationLoading);

	React.useEffect(() => {
		if (!isUserLoading && !managerUser) {
			router.replace('/login');
		}
	}, [isUserLoading, managerUser, router]);
	const [steps, setSteps] = useState<StepProps[]>([
		{
			name: UIDStatus.CREATED,
			description: 'Created',
			isActive: false,
			isCompleted: true,
			isLast: false
		},
		{
			name: UIDStatus.SENT_FOR_APPROVAL,
			description: 'Sent for approval',
			isActive: declarationData?.status === UIDStatus.SENT_FOR_APPROVAL,
			isCompleted: declarationData?.status !== UIDStatus.SENT_FOR_APPROVAL,
			isLast: false
		},
		{
			name: declarationData?.status.includes('CONFLICT') ? 'CONFLICT' : 'Result',
			description: 'Reviewed',
			isActive: false,
			isCompleted: false,
			isLast: true
		}
	]);
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

	if (!targetUserId) {
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

	return (
		<FormProvider {...formMethods}>
			<div className="w-full space-y-6 p-6">
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.back()}
					className="mb-4 cursor-pointer border-zinc-200"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to User List
				</Button>
				<Stepper
					steps={steps}
					activeStep={steps.findIndex((step) => step.name === declarationData.status)}
					title="Steps"
				/>
				<div className="space-y-3 rounded-sm border border-zinc-200 p-4">
					<h2>Next steps:</h2>
					<Button>Create management plan</Button>
				</div>
				<div className="flex flex-1 gap-4 min-h-[400px]">
					<div className="min-w-max rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
						<div className="grid grid-cols-1 gap-y-5">
							<div>
								<span className="block text-sm text-gray-500">Number</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									DEC-{formatDeclId(declarationData?.declarationId)}
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
					<div className="flex-1 min-w-[300px] rounded-sm border border-gray-200 p-4 shadow-sm overflow-auto">
						{/* Map through questions and render the display component in read-only mode */}
						{declarationData.questionsWithAnswers.map((question, index) => (
							<QuestionDisplay
								key={question.id}
								question={question}
								questionIndex={index}
								isReadOnly={true} // <-- Set to read-only
							/>
						))}
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
