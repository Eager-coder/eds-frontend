// src/components/declaration/OpenEndedQuestion.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UIDQuestoinWithAnswresDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { AdditionalAnswersSection } from './AdditionalAnswersSection';
import { cn } from '@/lib/utils';

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
	isReadOnly?: boolean; // <-- Add prop
}

export function OpenEndedQuestion({ question, questionIndex, isReadOnly = false }: Props) {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	return (
		<FormItem className="space-y-3 p-4">
			<FormLabel
				className={cn(
					'text-base font-semibold',
					!isReadOnly && question.isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{question.orderNumber}. {question.description.en} {/* Add localization */}
				{question.note && <p className="mt-1 text-sm font-normal text-gray-500">{question.note.en}</p>}
			</FormLabel>

			{question.optionsWithAnswers.map((option, optIndex) => {
				const fieldName = `questions.${questionIndex}.openEndedAnswers.${optIndex}.answer`;
				const readOnlyValue = isReadOnly ? option.answer : undefined;
				const error = !isReadOnly
					? (errors as any)?.questions?.[questionIndex]?.openEndedAnswers?.[optIndex]?.answer
					: undefined;

				return (
					<FormItem key={option.id} className="ml-4 space-y-2">
						<Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
							{option.description.en} {/* Label for the specific input/display */}
						</Label>
						<FormControl>
							{isReadOnly ? (
								<p className="mt-1 min-h-[36px] rounded border bg-gray-50 p-2 text-sm text-gray-800">
									{readOnlyValue || <span className="text-gray-500 italic">Not provided</span>}
								</p>
							) : (
								<Input
									id={fieldName}
									{...register(fieldName, {
										required: question.isRequired ? 'This field is required' : false
									})}
									placeholder={`Enter details for ${option.description.en}`}
									className={error ? 'border-red-500' : ''}
									readOnly={isReadOnly} // Make input readOnly visually if needed, though replaced above
								/>
							)}
						</FormControl>
						{!isReadOnly && <FormMessage>{error?.message}</FormMessage>}

						{/* Render Additional Answers */}
						{option.additionalAnswers && (
							<AdditionalAnswersSection
								controlNamePrefix={`questions.${questionIndex}.options.${optIndex}.additionalAnswers`}
								additionalAnswersData={option.additionalAnswers}
								allowMultiple={option.multipleAdditionalAnswers}
								parentOptionId={option.id}
								isReadOnly={isReadOnly}
								initialGroups={isReadOnly ? option.additionalAnswers.answers : undefined}
							/>
						)}
					</FormItem>
				);
			})}
		</FormItem>
	);
}
