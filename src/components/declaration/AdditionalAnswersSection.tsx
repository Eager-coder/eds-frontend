// src/components/declaration/AdditionalAnswersSection.tsx
import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import { UIDAdditionalAnswersDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { cn } from '@/lib/utils';

interface Props {
	controlNamePrefix: string;
	additionalAnswersData: UIDAdditionalAnswersDto;
	allowMultiple: boolean;
	parentOptionId: number;
	selectedOptionId?: number | null;
	isReadOnly?: boolean; // <-- Add isReadOnly prop
	initialGroups?: any[]; // <-- Add prop to pass fetched answer groups for read-only
}

export function AdditionalAnswersSection({
	controlNamePrefix,
	additionalAnswersData,
	allowMultiple,
	parentOptionId,
	selectedOptionId,
	isReadOnly = false, // Default to false
	initialGroups = [] // Default to empty array
}: Props) {
	const {
		control,
		register,
		formState: { errors },
		getValues
	} = useFormContext();
	const fieldArrayName = `${controlNamePrefix}`;

	const { fields, append, remove } = useFieldArray({
		control,
		name: fieldArrayName
	});

	const isRelevant = selectedOptionId === undefined || selectedOptionId === parentOptionId;

	// In read-only mode, use the initialGroups passed from props
	const displayFields = isReadOnly ? initialGroups : fields;

	// Effect to add default group only runs in editable mode
	React.useEffect(() => {
		if (!isReadOnly && isRelevant && fields.length === 0 && additionalAnswersData?.questions?.length > 0) {
			const defaultGroup = {
				answers: additionalAnswersData.questions.map((q) => ({
					additionalAnswerId: q.id,
					answer: ''
				}))
			};
			append(defaultGroup, { shouldFocus: false });
		}
	}, [isReadOnly, isRelevant, fields.length, append, additionalAnswersData?.questions]);

	if (!isRelevant || !additionalAnswersData?.questions?.length || displayFields.length === 0) {
		return null;
	}

	const addAnswerGroup = () => {
		if (isReadOnly) return; // Don't add in read-only
		const newGroup = {
			answers: additionalAnswersData.questions.map((q) => ({
				additionalAnswerId: q.id,
				answer: ''
			}))
		};
		append(newGroup);
	};

	return (
		<div className="mt-4 space-y-6 rounded-md border border-gray-300 bg-gray-100 p-4">
			<h4 className="font-semibold text-gray-700">Additional Information Provided:</h4>
			{displayFields.map((groupField, groupIndex) => (
				<div
					key={isReadOnly ? groupIndex : groupField.id}
					className="relative space-y-4 rounded border border-gray-200 bg-white p-4"
				>
					{!isReadOnly &&
						allowMultiple &&
						fields.length > 1 && ( // Only show remove button if editable
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
						// In read-only mode, get the value directly from the initialGroups prop
						const readOnlyValue = isReadOnly ? groupField?.answers?.[subQuestionIndex]?.answer : undefined;
						const error = !isReadOnly
							? (errors as any)?.questions?.additionalAnswers?.[groupIndex]?.answers?.[subQuestionIndex]
									?.answer
							: undefined;

						return (
							<FormItem key={subQuestion.id}>
								<FormLabel
									htmlFor={fieldName}
									className={cn(
										!isReadOnly &&
											subQuestion.isRequired &&
											"after:ml-0.5 after:text-red-500 after:content-['*']"
									)}
								>
									{subQuestion.description.en} {/* Add localization */}
								</FormLabel>
								<FormControl>
									{isReadOnly ? (
										<p className="mt-1 min-h-[36px] rounded border bg-gray-50 p-2 text-sm text-gray-800">
											{readOnlyValue || (
												<span className="text-gray-500 italic">Not provided</span>
											)}
										</p>
									) : (
										<Input
											id={fieldName}
											{...register(fieldName, {
												required: subQuestion.isRequired ? 'This field is required' : false
											})}
											placeholder={`Enter ${subQuestion.description.en}`}
											className={error ? 'border-red-500' : ''}
										/>
									)}
								</FormControl>
								{!isReadOnly && <FormMessage>{error?.message}</FormMessage>}
							</FormItem>
						);
					})}
				</div>
			))}

			{!isReadOnly &&
				allowMultiple && ( // Only show add button if editable
					<Button type="button" variant="outline" size="sm" onClick={addAnswerGroup}>
						<Plus className="mr-2 h-4 w-4" /> Add Another Set
					</Button>
				)}
		</div>
	);
}
