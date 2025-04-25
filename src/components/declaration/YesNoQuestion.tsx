// src/components/declaration/YesNoQuestion.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
	UIDQuestoinWithAnswresDto,
	UIDOptionWithAnswersDto
} from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { AdditionalAnswersSection } from './AdditionalAnswersSection';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
	isReadOnly?: boolean; // <-- Add prop
}

export function YesNoQuestion({ question, questionIndex, isReadOnly = false }: Props) {
	const { control, watch, getValues } = useFormContext();
	const fieldName = `questions.${questionIndex}.selectedOptionId`;

	// In read-only mode, determine the selected option from the initial data
	const readOnlySelectedOption = isReadOnly ? question.optionsWithAnswers.find((opt) => opt.isAnswered) : undefined;
	const readOnlySelectedId = readOnlySelectedOption?.id;

	// Watch the selected value for conditional rendering in editable mode
	const formSelectedOptionId = !isReadOnly ? watch(fieldName) : undefined;
	const displaySelectedOptionId = isReadOnly ? readOnlySelectedId : formSelectedOptionId;

	return (
		<FormItem className="space-y-3 rounded-md p-4">
			<FormLabel
				className={cn(
					'text-base font-semibold',
					!isReadOnly && question.isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{question.orderNumber}. {question.description.en} {/* Add localization */}
				{question.note && (
					<div className="mt-1 flex gap-2 rounded bg-sky-50/90 p-2 text-sm font-normal text-gray-700">
						<Info width={20} height={20} className="text-sky-600" />
						<p className="w-full flex-1">{question.note.en}</p>
					</div>
				)}
			</FormLabel>

			{isReadOnly ? (
				// Read-only display
				<div className="pt-2 pl-2">
					{question.optionsWithAnswers.map((option) => (
						<div key={option.id} className="mb-2 flex items-center space-x-2">
							<div
								className={cn(
									'flex h-4 w-4 items-center justify-center rounded-full border',
									option.id === readOnlySelectedId
										? 'border-blue-600 bg-blue-600'
										: 'border-gray-400 bg-white'
								)}
							>
								{option.id === readOnlySelectedId && (
									<div className="h-2 w-2 rounded-full bg-white"></div>
								)}
							</div>
							<Label
								className={cn(
									'font-normal',
									option.id === readOnlySelectedId ? 'font-medium text-gray-900' : 'text-gray-600'
								)}
							>
								{option.description.en} {/* Add localization */}
							</Label>
						</div>
					))}
					{!readOnlySelectedId && <p className="mt-2 text-sm text-gray-500 italic">No option selected.</p>}
				</div>
			) : (
				// Editable display
				<Controller
					name={fieldName}
					control={control}
					rules={{ required: question.isRequired ? 'Please select an option' : false }}
					render={({ field, fieldState: { error } }) => (
						<>
							<FormControl>
								<RadioGroup
									onValueChange={(value) => field.onChange(Number(value))}
									value={field.value?.toString()}
									className="flex flex-col space-y-2"
									disabled={isReadOnly} // Disable in read-only
								>
									{question.optionsWithAnswers.map((option) => (
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
			)}

			{/* Render Additional Answers - logic remains similar, but pass isReadOnly and initial data */}
			{question.optionsWithAnswers.map((option, optIndex) =>
				option.additionalAnswers ? (
					<AdditionalAnswersSection
						key={option.id}
						controlNamePrefix={`questions.${questionIndex}.options.${optIndex}.additionalAnswers`}
						additionalAnswersData={option.additionalAnswers}
						allowMultiple={option.multipleAdditionalAnswers}
						parentOptionId={option.id}
						selectedOptionId={displaySelectedOptionId} // Use the determined selected ID
						isReadOnly={isReadOnly}
						additionalAnswerDescription={option.additionalAnswerDescription}
						// Pass the fetched additional answers for this option for read-only display
						initialGroups={isReadOnly ? option.additionalAnswers.answers : undefined}
					/>
				) : null
			)}
		</FormItem>
	);
}
