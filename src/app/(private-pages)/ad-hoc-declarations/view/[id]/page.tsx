'use client';

import { AdHocStatus, useGetAdHocDeclare } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { useUser } from '@/context/UserContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdHocDeclarationDetailPage() {
	const router = useRouter();
	const params = useParams();
	const declarationId = Number(params.id);
	const { user, isLoading: isUserLoading } = useUser();

	// Fetch the declaration data
	const { data: declaration, isPending, isError } = useGetAdHocDeclare(declarationId);

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (!user && !isUserLoading) {
			router.replace('/login');
		}
	}, [user, isUserLoading, router]);

	// Function to get a status badge with appropriate color
	const getStatusBadge = (status: AdHocStatus) => {
		const statusColors = {
			[AdHocStatus.CREATED]: 'bg-blue-100 text-blue-800 border-blue-200',
			[AdHocStatus.SENT_FOR_APPROVAL]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			[AdHocStatus.ACTUAL_CONFLICT]: 'bg-red-100 text-red-800 border-red-200',
			[AdHocStatus.PERCEIVED_CONFLICT]: 'bg-orange-100 text-orange-800 border-orange-200',
			[AdHocStatus.NO_CONFLICT]: 'bg-green-100 text-green-800 border-green-200',
			[AdHocStatus.APPROVED]: 'bg-purple-100 text-purple-800 border-purple-200'
		};

		return (
			<Badge variant="outline" className={`px-2 py-1 ${statusColors[status]} border`}>
				{status.replace(/_/g, ' ')}
			</Badge>
		);
	};

	// Loading state
	if (isPending || isUserLoading) {
		return (
			<div className="w-full flex-1 p-6">
				<div className="flex h-64 items-center justify-center">
					<div className="text-lg">Loading declaration details...</div>
				</div>
			</div>
		);
	}

	// Error state
	if (isError || !declaration) {
		return (
			<div className="w-full flex-1 p-6">
				<div className="flex h-64 items-center justify-center">
					<div className="text-lg text-red-500">Error loading declaration details</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex-1 p-6">
			{/* Back button */}
			<Link href="/ad-hoc-declarations" className="mb-4 inline-flex items-center text-blue-600 hover:underline">
				<ArrowLeft className="mr-1" size={16} />
				Back to declarations
			</Link>

			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Ad-hoc Declaration #{declaration.id}</h1>
				{getStatusBadge(declaration.status)}
			</div>

			{/* Main information card */}
			<Card className="mb-6 rounded-sm border-zinc-200 shadow-none">
				<CardHeader>
					<CardTitle>Declaration Details</CardTitle>
					<CardDescription>General information about this declaration</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h3 className="text-sm font-medium text-gray-500">Created Date</h3>
							<p className="mt-1">{format(new Date(declaration.createAt), 'dd MMMM yyyy, HH:mm')}</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">Status</h3>
							<div className="mt-1">{getStatusBadge(declaration.status)}</div>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">Created By</h3>
							<p className="mt-1">{`${declaration.createdBy.firstname} ${declaration.createdBy.lastname}`}</p>
							<p className="text-sm text-gray-500">{declaration.createdBy.email}</p>
							<p className="text-sm text-gray-500">
								{declaration.createdBy.position}, {declaration.createdBy.department}
							</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">User</h3>
							<p className="mt-1">{`${declaration.user.firstname} ${declaration.user.lastname}`}</p>
							<p className="text-sm text-gray-500">{declaration.user.email}</p>
							<p className="text-sm text-gray-500">
								{declaration.user.position}, {declaration.user.department}
							</p>
						</div>

						{declaration.responsible && (
							<div>
								<h3 className="text-sm font-medium text-gray-500">Responsible Person</h3>
								<p className="mt-1">{`${declaration.responsible.firstname} ${declaration.responsible.lastname}`}</p>
								<p className="text-sm text-gray-500">{declaration.responsible.email}</p>
								<p className="text-sm text-gray-500">
									{declaration.responsible.position}, {declaration.responsible.department}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Declared conflicts */}
			<Card className="mb-6 rounded-sm border-zinc-200 shadow-none">
				<CardHeader>
					<CardTitle>Declared Conflicts</CardTitle>
					<CardDescription>Types of conflicts declared in this submission</CardDescription>
				</CardHeader>
				<CardContent>
					{declaration.answers.length > 0 ? (
						<div className="space-y-6">
							{declaration.answers.map((answer, index) => (
								<div key={index} className="border-b border-zinc-200 pb-4 last:border-0 last:pb-0">
									<h3 className="mb-2 font-medium">{answer.categoryDescription.en}</h3>
									<p className="whitespace-pre-wrap text-gray-700">{answer.conflictDescription}</p>
									{answer.otherCategory && (
										<div className="mt-2">
											<span className="text-sm font-medium text-gray-500">Other Category:</span>
											<span className="ml-2">{answer.otherCategory}</span>
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No conflicts declared</p>
					)}
				</CardContent>
			</Card>

			{/* Agreement statements */}
			<Card className="rounded-sm border-zinc-200 shadow-none">
				<CardHeader>
					<CardTitle>Agreement Statements</CardTitle>
					<CardDescription>
						{declaration.hasAgreedWithStatements
							? 'User has agreed to the following statements'
							: 'User has NOT agreed to statements'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{declaration.statementAgreementStatuses.length > 0 ? (
						<div className="space-y-4">
							{declaration.statementAgreementStatuses.map((statement, index) => (
								<div key={index} className="flex items-start">
									<div className="mt-1 mr-2 flex-shrink-0">
										<svg
											className="h-5 w-5 text-green-500"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<p className="text-gray-700">{statement.en}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No statements available</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
