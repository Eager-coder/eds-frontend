'use client';

import React from 'react';
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

function formatDeclId(id: number | undefined): string {
	return id?.toString().padStart(5, '0') ?? 'N/A';
}
const formatDetailedDateTime = (isoDateString: string | undefined): string => {
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
const formatUserName = (user: UIDResponse['user'] | null | undefined): string => {
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

	// We still need useForm to provide context to QuestionDisplay and its children,
	// even though we are not actually submitting or validating here.
	// The default values don't matter much in read-only mode.
	const formMethods = useForm<DeclarationAnswersFormValues>({
		// resolver: zodResolver(declarationAnswersSchema), // Not strictly needed for read-only
		defaultValues: { questions: [] }
	});

	const combinedLoading = isUserLoading || (!!targetUserId && isDeclarationLoading); // Only consider declaration loading if targetUserId is valid

	// --- Auth & Role Checks ---
	React.useEffect(() => {
		if (!isUserLoading && !managerUser) {
			router.replace('/login');
		}
		// Optional: Redirect if user doesn't have the required role
		// else if (!isUserLoading && managerUser && managerUser.role !== 'MANAGER' && managerUser.role !== 'ADMIN' && managerUser.role !== 'SUPER_ADMIN') {
		//     router.replace('/'); // Or show an unauthorized page
		// }
	}, [isUserLoading, managerUser, router]);

	// --- Loading State ---
	if (combinedLoading) {
		return <ViewDeclarationSkeleton />;
	}

	// --- Ensure manager is loaded and has appropriate role ---
	if (
		!managerUser ||
		(managerUser.role !== 'MANAGER' && managerUser.role !== 'ADMIN' && managerUser.role !== 'SUPER_ADMIN')
	) {
		// User might be logged in but not a manager/admin, or still loading roles
		// You could show an unauthorized message or redirect
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

	// --- Invalid Target User ID ---
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

	// --- Declaration Not Found State ---
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
				<div className="flex gap-4">
					<div className="min-w-max rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
						<div className="grid grid-cols-1 gap-y-5">
							{' '}
							{/* Use grid for consistent spacing */}
							{/* Number */}
							<div>
								<span className="block text-sm text-gray-500">Number</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									DEC-{formatDeclId(declarationData?.declarationId)}
								</p>
							</div>
							{/* Created by */}
							<div>
								<span className="block text-sm text-gray-500">Created by</span>
								{/* Assuming createdBy holds the user who created this specific instance */}
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-blue-600">
									{formatUserName(declarationData?.createdBy)}
								</p>
							</div>
							{/* Created on */}
							<div>
								<span className="block text-sm text-gray-500">Created on</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{formatDetailedDateTime(declarationData?.creationDate)}
								</p>
							</div>
							{/* Position/Manager - Using the user's position from the 'user' object */}
							<div>
								<span className="block text-sm text-gray-500">Position/Manager</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{declarationData?.user?.position || 'N/A'}
								</p>
							</div>
							{/* Department/Office/School - Using the user's department */}
							<div>
								<span className="block text-sm text-gray-500">Department/Office/School</span>
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
									{declarationData?.user?.department || 'N/A'}
								</p>
							</div>
							{/* Status */}
							<div>
								<span className="block text-sm text-gray-500">Status</span>
								{/* Removed last border: last:border-b-0 */}
								<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900 capitalize last:border-b-0">
									{declarationData?.status?.toLowerCase() ?? 'N/A'}
								</p>
							</div>
						</div>
					</div>
					<div className="rounded-sm border border-gray-200 p-4 shadow-sm">
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
