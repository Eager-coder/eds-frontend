// src/components/declaration/YesNoQuestion.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UIDQuestoinWithAnswresDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { AdditionalAnswersSection } from './AdditionalAnswersSection';
import { cn } from '@/lib/utils';

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
}

export function YesNoQuestion({ question, questionIndex }: Props) {
	const { control, watch } = useFormContext();
	const fieldName = `questions.${questionIndex}.selectedOptionId`;

	// Watch the selected value to conditionally render additional answers
	const selectedOptionId = watch(fieldName);

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
			<Controller
				name={fieldName}
				control={control}
				rules={{ required: question.isRequired ? 'Please select an option' : false }}
				render={({ field, fieldState: { error } }) => (
					<>
						<FormControl>
							<RadioGroup
								onValueChange={(value) => field.onChange(Number(value))} // Ensure value is number
								value={field.value?.toString()} // Ensure value is string for RadioGroup
								className="flex flex-col space-y-2"
							>
								{question.optionsWithAnswers.map((option, optIndex) => (
									<FormItem key={option.id} className="flex items-center space-y-0 space-x-3">
										<FormControl>
											<RadioGroupItem
												value={option.id.toString()}
												id={`${fieldName}-${option.id}`}
											/>
										</FormControl>
										<Label htmlFor={`${fieldName}-${option.id}`} className="font-normal">
											{option.description.en} {/* Add localization */}
										</Label>
									</FormItem>
								))}
							</RadioGroup>
						</FormControl>
						<FormMessage>{error?.message}</FormMessage>
					</>
				)}
			/>

			{/* Render Additional Answers for each option, but only display the one matching the selection */}
			{question.optionsWithAnswers.map((option, optIndex) =>
				option.additionalAnswers ? (
					<AdditionalAnswersSection
						key={option.id}
						controlNamePrefix={`questions.${questionIndex}.options.${optIndex}.additionalAnswers`}
						additionalAnswersData={option.additionalAnswers}
						allowMultiple={option.multipleAdditionalAnswers}
						parentOptionId={option.id}
						selectedOptionId={selectedOptionId}
					/>
				) : null
			)}
		</FormItem>
	);
}
