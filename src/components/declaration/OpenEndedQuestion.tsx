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
}

export function OpenEndedQuestion({ question, questionIndex }: Props) {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	return (
		<FormItem className="space-y-3 rounded-md border p-4">
			<FormLabel
				className={cn(
					'text-base font-semibold',
					question.isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{question.orderNumber}. {question.description.en} {/* Add localization */}
				{question.note && <p className="mt-1 text-sm font-normal text-gray-500">{question.note.en}</p>}
			</FormLabel>

			{/* Render input for each option */}
			{question.optionsWithAnswers.map((option, optIndex) => {
				const fieldName = `questions.${questionIndex}.openEndedAnswers.${optIndex}.answer`;

				const error = errors.questions?.[questionIndex]?.openEndedAnswers?.[optIndex]?.answer;

				return (
					<FormItem key={option.id} className="ml-4 space-y-2">
						{' '}
						{/* Indent options slightly */}
						<Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
							{option.description.en} {/* Label for the specific input */}
						</Label>
						<FormControl>
							<Input
								id={fieldName}
								{...register(fieldName, {
									// Add conditional required validation if needed based on parent question's isRequired
									required: question.isRequired ? 'This field is required' : false
								})}
								placeholder={`Enter details for ${option.description.en}`}
								className={error ? 'border-red-500' : ''}
							/>
						</FormControl>
						<FormMessage>{error?.message}</FormMessage>
						{/* Render Additional Answers if this option has them */}
						{option.additionalAnswers && (
							<AdditionalAnswersSection
								controlNamePrefix={`questions.${questionIndex}.options.${optIndex}.additionalAnswers`}
								additionalAnswersData={option.additionalAnswers}
								allowMultiple={option.multipleAdditionalAnswers}
								parentOptionId={option.id}
								// selectedOptionId is not needed for OPEN_ENDED
							/>
						)}
					</FormItem>
				);
			})}
		</FormItem>
	);
}
