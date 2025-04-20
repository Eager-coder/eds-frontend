// src/components/declaration/AdditionalAnswersSection.tsx
import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'; // Assuming FormLabel exists or use Label
import { Plus, Trash2 } from 'lucide-react';
import { UIDAdditionalAnswersDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { cn } from '@/lib/utils';

interface Props {
	controlNamePrefix: string; // e.g., `questions.${qIndex}.options.${optIndex}.additionalAnswers`
	additionalAnswersData: UIDAdditionalAnswersDto;
	allowMultiple: boolean;
	parentOptionId: number; // Needed to ensure we only show this for the *selected* option
	selectedOptionId?: number | null; // The currently selected optionId for YES_NO questions
}

export function AdditionalAnswersSection({
	controlNamePrefix,
	additionalAnswersData,
	allowMultiple,
	parentOptionId,
	selectedOptionId
}: Props) {
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext(); // Use context

	// Name for useFieldArray should point to the array of answer groups
	const fieldArrayName = `${controlNamePrefix}`;

	const { fields, append, remove } = useFieldArray({
		control,
		name: fieldArrayName
	});

	// Only render if this section belongs to the currently selected option (for YES_NO)
	// For OPEN_ENDED or AGREE, selectedOptionId might not be relevant, assume always show if data exists
	const isRelevant = selectedOptionId === undefined || selectedOptionId === parentOptionId;

	// Ensure at least one group exists if required and relevant
	React.useEffect(() => {
		if (isRelevant && fields.length === 0) {
			const defaultGroup = {
				answers: additionalAnswersData.questions.map((q) => ({
					additionalAnswerId: q.id,
					answer: ''
				}))
			};
			append(defaultGroup, { shouldFocus: false });
		}
	}, [isRelevant, fields.length, append, additionalAnswersData.questions]);

	if (!isRelevant || !additionalAnswersData?.questions?.length) {
		return null;
	}

	// Function to add a new group of answers
	const addAnswerGroup = () => {
		const newGroup = {
			answers: additionalAnswersData.questions.map((q) => ({
				additionalAnswerId: q.id,
				answer: '' // Initialize with empty answer
			}))
		};
		append(newGroup);
	};

	return (
		<div className="mt-4 space-y-6 rounded-md border border-gray-300 bg-gray-50 p-4">
			<h4 className="font-semibold text-gray-700">Additional Information Required:</h4>
			{fields.map((groupField, groupIndex) => (
				<div key={groupField.id} className="relative space-y-4 rounded border border-gray-200 bg-white p-4">
					{allowMultiple && fields.length > 1 && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
							onClick={() => remove(groupIndex)}
						>
							<Trash2 className="h-4 w-4" />
							<span className="sr-only">Remove Group</span>
						</Button>
					)}
					{additionalAnswersData.questions.map((subQuestion, subQuestionIndex) => {
						const fieldName = `${fieldArrayName}.${groupIndex}.answers.${subQuestionIndex}.answer`;
						// const error = (errors as any)?.questions?.[/*qIndex*/]?.[/*options*/]?.[/*optIndex*/]?.additionalAnswers?.[groupIndex]?.answers?.[subQuestionIndex]?.answer; // Adjust path based on actual RHF structure

						return (
							<FormItem key={subQuestion.id}>
								<FormLabel
									htmlFor={fieldName}
									className={cn(
										subQuestion.isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
									)}
								>
									{subQuestion.description.en} {/* Assuming 'en' for now, add localization later */}
								</FormLabel>
								<FormControl>
									<Input
										id={fieldName}
										{...register(fieldName, {
											required: subQuestion.isRequired ? 'This field is required' : false
										})}
										placeholder={`Enter ${subQuestion.description.en}`}
										// className={error ? 'border-red-500' : ''}
									/>
								</FormControl>
								{/* <FormMessage>{error?.message}</FormMessage> */}
							</FormItem>
						);
					})}
				</div>
			))}

			{allowMultiple && (
				<Button type="button" variant="outline" size="sm" onClick={addAnswerGroup}>
					<Plus className="mr-2 h-4 w-4" /> Add Another Set
				</Button>
			)}
		</div>
	);
}
