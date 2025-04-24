'use client';
import { useGetAdHocDeclare, AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { useUser } from '@/context/UserContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { updateAdHocDeclare } from '@/api-client/manager/ad-hoc-declarations/updateAdHocDeclare';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdHocDeclarationManagerPage() {
	const router = useRouter();
	const params = useParams();
	const declarationId = Number(params.id);
	const { user, isLoading: isUserLoading } = useUser();
	const queryClient = useQueryClient();

	// Fetch the declaration data
	const { data: declaration, isPending, isError, refetch } = useGetAdHocDeclare(declarationId);
	const [selectedStatus, setSelectedStatus] = useState<AdHocStatus | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	// Mutation for updating status
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: number; status: AdHocStatus }) => updateAdHocDeclare(id, status),
		onSuccess: () => {
			// Invalidate and refetch the declaration data
			queryClient.invalidateQueries({
				queryKey: ['adHocDeclare', declarationId]
			});
		}
	});

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (!user && !isUserLoading) {
			router.replace('/login');
		}
	}, [user, isUserLoading, router]);

	// Function to check if user is manager or admin
	const isManager = () => {
		return user && (user.role === 'MANAGER' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
	};

	const handleSaveStatus = () => {
		if (selectedStatus) {
			updateStatusMutation.mutate(
				{ id: declarationId, status: selectedStatus },
				{
					onSuccess: async () => {
						await refetch();
						setDialogOpen(false);
					}
				}
			);
		}
	};

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

	// Function to update declaration status
	const handleUpdateStatus = (status: AdHocStatus) => {
		updateStatusMutation.mutate({ id: declarationId, status });
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

	// Check if current status is a conflict status
	const hasConflict =
		declaration.status === AdHocStatus.ACTUAL_CONFLICT || declaration.status === AdHocStatus.PERCEIVED_CONFLICT;

	// Determine the visual step of the current status
	const getVisualStep = (status: AdHocStatus) => {
		if (status === AdHocStatus.CREATED) return 0;
		if (status === AdHocStatus.SENT_FOR_APPROVAL) return 1;
		return 2; // All remaining states (conflict or no conflict) are at step 3
	};

	const currentVisualStep = getVisualStep(declaration.status);

	return (
		<div className="w-full flex-1 p-6">
			{/* Back button */}
			<Link
				href="/manager/ad-hoc-declarations"
				className="mb-4 inline-flex items-center text-blue-600 hover:underline"
			>
				<ArrowLeft className="mr-1" size={16} />
				Back to declarations
			</Link>

			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Manage Ad-hoc Declaration #{declaration.id}</h1>
				{getStatusBadge(declaration.status)}
			</div>

			{/* Status Progress Bar */}
			<div className="mb-8">
				<div className="relative flex h-12 w-full items-center justify-between">
					{/* Status Steps */}
					<div className="absolute right-0 left-0 flex justify-between">
						{/* Step 1: Created */}
						<div
							className={`z-10 flex h-10 w-10 items-center justify-center rounded-full text-white ${currentVisualStep >= 0 ? 'bg-green-600' : 'bg-zinc-200'}`}
						>
							{currentVisualStep >= 0 ? <Check size={20} /> : '1'}
						</div>

						{/* Step 2: Sent for approval */}
						<div
							className={`z-10 flex h-10 w-10 items-center justify-center rounded-full text-white ${currentVisualStep >= 1 ? 'bg-green-600' : 'bg-zinc-200'}`}
						>
							{currentVisualStep >= 1 ? <Check size={20} /> : '2'}
						</div>

						{/* Step 3: Review result (Conflict or No Conflict) */}
						<div
							className={`z-10 flex h-10 w-10 items-center justify-center rounded-full text-white ${
								currentVisualStep >= 2 ? (hasConflict ? 'bg-red-600' : 'bg-green-600') : 'bg-zinc-200'
							}`}
						>
							{currentVisualStep >= 2 ? <Check size={20} /> : '3'}
						</div>
					</div>

					{/* Connecting Lines */}
					<div className="absolute top-5 right-5 left-5 flex h-2">
						{/* First segment: Created to Sent for approval */}
						<div className={`flex-1 ${currentVisualStep >= 1 ? 'bg-green-600' : 'bg-zinc-200'}`} />

						{/* Second segment: Sent for approval to Review result */}
						<div
							className={`flex-1 ${
								currentVisualStep >= 2 ? (hasConflict ? 'bg-red-600' : 'bg-green-600') : 'bg-zinc-200'
							}`}
						/>
					</div>
				</div>

				{/* Status Labels */}
				<div className="mt-3 flex justify-between text-sm">
					<div className="text-center">Created</div>
					<div className="text-center">Sent for approval</div>
					<div className="text-center">
						{hasConflict ? 'Conflict identified' : currentVisualStep >= 2 ? 'No conflict' : 'Reviewed'}
					</div>
				</div>
			</div>

			{/* Main information card */}
			<Card className="mb-6 border-zinc-200">
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
			<Card className="mb-6 border-zinc-200">
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
			<Card className="mb-6 border-zinc-200">
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

			{/* Manager actions */}
			<Card className="border-zinc-200">
				<CardHeader>
					<CardTitle>Manager Actions</CardTitle>
					<CardDescription>Review and update the status of this declaration</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p>Please review the declaration and select the appropriate status below.</p>
						<Select onValueChange={(value: AdHocStatus) => setSelectedStatus(value)}>
							<SelectTrigger className="w-[250px]">
								<SelectValue placeholder="Select a status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={AdHocStatus.ACTUAL_CONFLICT}>Actual Conflict</SelectItem>
								<SelectItem value={AdHocStatus.PERCEIVED_CONFLICT}>Perceived Conflict</SelectItem>
								<SelectItem value={AdHocStatus.NO_CONFLICT}>No Conflict</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="min-w-40 cursor-pointer bg-[#DDAF53] text-white hover:bg-amber-700"
						onClick={() => setDialogOpen(true)}
						disabled={!selectedStatus}
					>
						Save
					</Button>
				</CardFooter>
			</Card>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Status Update</DialogTitle>
					</DialogHeader>
					<div className="p-4">
						<p>
							Are you sure you want to change the declaration status to:{' '}
							<strong>{selectedStatus?.replace(/_/g, ' ')}</strong>?
						</p>
					</div>
					<DialogFooter>
						<Button
							className="cursor-pointer bg-[#DDAF53] text-white hover:bg-amber-700"
							onClick={handleSaveStatus}
							disabled={updateStatusMutation.isPending}
						>
							Confirm
						</Button>
						<Button
							variant="outline"
							className="cursor-pointer border border-zinc-300"
							onClick={() => setDialogOpen(false)}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
