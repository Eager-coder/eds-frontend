'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import {
	getUserInitialDeclaration,
	UIDResponse,
	useUserInitialDeclaration
} from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import {
	submitDeclarationAnswers,
	SubmitDeclarationAnswersRequest
} from '@/api-client/user/initial-declarations/submitDeclarationAnswers';
import { declarationAnswersSchema, DeclarationAnswersFormValues } from '@/schemas/declarationAnswersSchema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { QuestionDisplay } from '@/components/declaration/QuestionDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';
import { formatDetailedDateTime, formatUserName } from '../manager/initial-declarations/[id]/page';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { fetchClient } from '@/lib/client';

function formatDeclId(id: number | undefined): string {
	return id?.toString().padStart(5, '0') ?? 'N/A';
}

const mapDataToFormValues = (data: UIDResponse | null): DeclarationAnswersFormValues => {
	if (!data) {
		return { questions: [] };
	}

	return {
		questions: data.questionsWithAnswers.map((q) => ({
			questionId: q.id,
			questionType: q.questionType,

			selectedOptionId:
				q.questionType === 'YES_NO' ? (q.optionsWithAnswers.find((opt) => opt.isAnswered)?.id ?? null) : null,
			isAgreed: q.questionType === 'AGREE' ? (q.optionsWithAnswers[0]?.isAnswered ?? null) : null,
			openEndedAnswers:
				q.questionType === 'OPEN_ENDED'
					? q.optionsWithAnswers.map((opt) => ({
							optionId: opt.id,
							answer: opt.answer ?? ''
						}))
					: [],
			options: q.optionsWithAnswers.map((opt) => ({
				optionId: opt.id,

				additionalAnswers:
					opt.additionalAnswers?.answers?.map((group) => ({
						answers: group.answers.map((ans) => ({
							additionalAnswerId: ans.additionalAnswerId,
							answer: ans.answer ?? ''
						}))
					})) ?? []
			}))
		}))
	};
};

const mapFormValuesToPayload = (
	formValues: DeclarationAnswersFormValues,
	originalData: UIDResponse | null
): SubmitDeclarationAnswersRequest => {
	const payloadAnswers: SubmitDeclarationAnswersRequest['answers'] = [];

	formValues.questions.forEach((qForm, qIndex) => {
		const originalQuestion = originalData?.questionsWithAnswers[qIndex];
		if (!originalQuestion) return;

		switch (qForm.questionType) {
			case 'YES_NO':
				if (qForm.selectedOptionId !== null) {
					const selectedOptionIndex = originalQuestion.optionsWithAnswers.findIndex(
						(opt) => opt.id === qForm.selectedOptionId
					);
					if (selectedOptionIndex !== -1) {
						payloadAnswers.push({
							optionId: qForm.selectedOptionId!,
							isAnswered: true,
							additionalAnswers: qForm.options?.[selectedOptionIndex]?.additionalAnswers
						});

						originalQuestion.optionsWithAnswers.forEach((opt) => {
							if (opt.id !== qForm.selectedOptionId) {
								payloadAnswers.push({ optionId: opt.id, isAnswered: false });
							}
						});
					}
				} else {
					originalQuestion.optionsWithAnswers.forEach((opt) => {
						payloadAnswers.push({ optionId: opt.id, isAnswered: false });
					});
				}
				break;

			case 'AGREE':
				const agreeOptionId = originalQuestion.optionsWithAnswers[0]?.id;
				if (agreeOptionId) {
					payloadAnswers.push({
						optionId: agreeOptionId,
						isAnswered: qForm.isAgreed ?? false,
						additionalAnswers: qForm.options?.[0]?.additionalAnswers
					});
				}
				break;

			case 'OPEN_ENDED':
				qForm.openEndedAnswers?.forEach((oeAnswer, oeIndex) => {
					const openEndedOptionIndex = originalQuestion.optionsWithAnswers.findIndex(
						(opt) => opt.id === oeAnswer.optionId
					);
					if (openEndedOptionIndex !== -1) {
						payloadAnswers.push({
							optionId: oeAnswer.optionId,
							answer: oeAnswer.answer || null,
							additionalAnswers: qForm.options?.[openEndedOptionIndex]?.additionalAnswers
						});
					}
				});
				break;
		}
	});

	return { answers: payloadAnswers };
};

export default function Page() {
	const { isLoading: isUserLoading, user } = useUser();
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		data: declarationData,
		isLoading: isDeclarationLoading,
		error: declarationError
	} = useUserInitialDeclaration({
		userId: user?.id,
		enabled: !!user
	});

	const form = useForm<DeclarationAnswersFormValues>({
		resolver: zodResolver(declarationAnswersSchema),

		defaultValues: { questions: [] }
	});

	const downloadFile = async () => {
		const response = await fetchClient(`/export/initial-declaration/${declarationData?.userDeclarationId}/pdf`);
		console.log(response);
		// Read it as a Blob
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);

		// 1) Open in a new tab:
		window.open(url, '_blank');
	};

	useEffect(() => {
		if (declarationData) {
			form.reset(mapDataToFormValues(declarationData));
		}
	}, [declarationData, form]);

	const { mutate: submitAnswers, isPending: isSubmitting } = useMutation({
		mutationFn: (formData: DeclarationAnswersFormValues) => {
			if (!declarationData?.userDeclarationId) {
				throw new Error('Missing userDeclarationId');
			}
			const payload = mapFormValuesToPayload(formData, declarationData);
			return submitDeclarationAnswers(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userInitialDeclaration', user?.id] });
			alert('Declaration submitted successfully!');
		},
		onError: (error) => {
			console.error('Submission failed:', error);

			form.setError('root.serverError', { message: 'Submission failed. Please try again.' });
		}
	});

	// --- Handle Submit ---
	const onSubmit = (values: DeclarationAnswersFormValues) => {
		console.log('Form Values:', values);
		submitAnswers(values);
	};

	// --- Loading and Auth States ---
	const isLoading = isUserLoading || isDeclarationLoading;

	if (!isUserLoading && !user) {
		router.replace('/login');
		return null; // Don't render anything while redirecting
	}

	if (isLoading) {
		return (
			<div className="w-full flex-1 space-y-6 p-6">
				<Skeleton className="h-8 w-1/2" />
				<Skeleton className="h-6 w-1/3" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-24 w-full rounded-md" />
					))}
				</div>
				<Skeleton className="h-10 w-32" />
			</div>
		);
	}

	if (declarationError) {
		return <div className="p-4 text-red-600">Error loading declaration: {declarationError.message}</div>;
	}

	if (!declarationData) {
		return (
			<div className="flex-1 p-4">
				<h1 className="text-xl font-semibold italic">No Initial Declaration Found</h1>
				<p className="text-gray-600">There might not be an active declaration assigned to you at the moment.</p>
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
		<div className="w-full flex-1 space-y-4 p-4">
			<div className="w-full border-none bg-zinc-50">
				<div className="flex gap-2">
					{/* Stepper */}
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
							<div className={`text-base font-semibold`}>{hasConflict ? 'Conflict' : 'No Conflict'}</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex min-h-[400px] flex-1 gap-4">
				<div className="grid h-max min-w-max grid-cols-1 gap-y-5 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
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
						<span className="block text-sm text-gray-500">Responsible</span>
						<p className="mt-1 border-b border-gray-300 pb-2 text-base font-semibold text-gray-900">
							{formatUserName(declarationData?.responsible) || 'N/A'}
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
							{declarationData.status.toLowerCase()}
						</p>
					</div>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="min-w-[300px] flex-1 overflow-auto rounded-sm border border-gray-200 p-4 shadow-sm"
					>
						{declarationData.questionsWithAnswers.map((question, index) => (
							<QuestionDisplay
								isReadOnly={declarationData.status !== UIDStatus.CREATED}
								key={question.id}
								question={question}
								questionIndex={index}
							/>
						))}

						{form.formState.errors.root?.serverError && (
							<p className="text-sm font-medium text-red-500">
								{form.formState.errors.root.serverError.message}
							</p>
						)}
						{declarationData.status === UIDStatus.NO_CONFLICT ||
						declarationData.status === UIDStatus.ACTUAL_CONFLICT ||
						declarationData.status === UIDStatus.PERCEIVED_CONFLICT ? (
							<Button
								onClick={downloadFile}
								type="button"
								className="mt-6 flex w-max cursor-pointer items-center justify-center gap-2 rounded bg-[#DDAF53] px-3 py-2 text-white hover:bg-amber-600"
							>
								<Download /> Export PDF
							</Button>
						) : null}

						{declarationData.status === UIDStatus.CREATED && (
							<Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600">
								{isSubmitting ? 'Submitting...' : 'Submit Declaration'}
							</Button>
						)}
					</form>
				</Form>
			</div>
		</div>
	);
}
