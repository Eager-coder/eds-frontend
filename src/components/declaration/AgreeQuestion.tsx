// src/components/declaration/AgreeQuestion.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UIDQuestoinWithAnswresDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { AdditionalAnswersSection } from './AdditionalAnswersSection'; // Might be needed if AGREE can have them
import { cn } from '@/lib/utils';

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
}

export function AgreeQuestion({ question, questionIndex }: Props) {
	const { control } = useFormContext();
	const fieldName = `questions.${questionIndex}.isAgreed`;

	// AGREE questions typically have one implicit option representing agreement.
	const agreeOption = question.optionsWithAnswers[0]; // Assume first option is the 'agree' one

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
				rules={{ required: question.isRequired ? 'You must agree to continue' : false }}
				render={({ field, fieldState: { error } }) => (
					<>
						<FormItem className="flex flex-row items-start space-y-0 space-x-3">
							<FormControl>
								<Checkbox
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									id={fieldName}
									aria-describedby={`${fieldName}-message`}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<Label htmlFor={fieldName} className="font-normal">
									{agreeOption?.description?.en ?? 'I Agree'} {/* Use option desc or default */}
								</Label>
							</div>
						</FormItem>
						<FormMessage id={`${fieldName}-message`}>{error?.message}</FormMessage>
					</>
				)}
			/>

			{/* Render Additional Answers if the agree option has them (uncommon but possible) */}
			{agreeOption?.additionalAnswers && (
				<AdditionalAnswersSection
					controlNamePrefix={`questions.${questionIndex}.options.0.additionalAnswers`} // Index 0 for the single agree option
					additionalAnswersData={agreeOption.additionalAnswers}
					allowMultiple={agreeOption.multipleAdditionalAnswers}
					parentOptionId={agreeOption.id}
					// selectedOptionId is not needed here as there's only one state (checked/unchecked)
				/>
			)}
		</FormItem>
	);
}
