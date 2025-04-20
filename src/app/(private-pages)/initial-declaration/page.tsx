'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import {
	getUserInitialDeclaration,
	UIDResponse
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
							additionalAnswers: qForm.options?.[selectedOptionIndex]?.additionalAnswers // Pass the array of groups
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
	} = useQuery<UIDResponse, Error>({
		queryKey: ['userInitialDeclaration', user?.id],
		queryFn: () => getUserInitialDeclaration(user!.id!),
		enabled: !!user,
		staleTime: 5 * 60 * 1000
	});

	const form = useForm<DeclarationAnswersFormValues>({
		resolver: zodResolver(declarationAnswersSchema),

		defaultValues: { questions: [] }
	});

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
			<div className="w-full space-y-6 p-6">
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
			<div className="p-4">
				<h1 className="text-xl font-semibold italic">No Initial Declaration Found</h1>
				<p className="text-gray-600">There might not be an active declaration assigned to you at the moment.</p>
			</div>
		);
	}

	// --- Render Form ---
	return (
		<div className="w-full space-y-6 p-6">
			<h1 className="text-2xl font-bold text-zinc-700">
				Initial Declaration: {declarationData.declarationName} [DEC-
				{formatDeclId(declarationData?.declarationId)}]
			</h1>
			<p className="text-gray-600">Please answer the following questions carefully.</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* Map through questions and render the appropriate component */}
					{declarationData.questionsWithAnswers.map((question, index) => (
						<QuestionDisplay key={question.id} question={question} questionIndex={index} />
					))}

					{form.formState.errors.root?.serverError && (
						<p className="text-sm font-medium text-red-500">
							{form.formState.errors.root.serverError.message}
						</p>
					)}

					<Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600">
						{isSubmitting ? 'Submitting...' : 'Submit Declaration'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
