// src/components/declaration/AgreeQuestion.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UIDQuestoinWithAnswresDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { AdditionalAnswersSection } from './AdditionalAnswersSection';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react'; // Import icons

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
	isReadOnly?: boolean; // <-- Add prop
}

export function AgreeQuestion({ question, questionIndex, isReadOnly = false }: Props) {
	const { control } = useFormContext();
	const fieldName = `questions.${questionIndex}.isAgreed`;
	const agreeOption = question.optionsWithAnswers[0];
	const readOnlyIsAgreed = isReadOnly ? agreeOption?.isAnswered : undefined;

	return (
		<FormItem className="space-y-3 rounded-md p-4">
			<FormLabel
				className={cn(
					'text-base font-semibold',
					!isReadOnly && question.isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{question.orderNumber}. {question.description.en} {/* Add localization */}
				{question.note && <p className="mt-1 text-sm font-normal text-gray-500">{question.note.en}</p>}
			</FormLabel>

			{isReadOnly ? (
				// Read-only display
				<div className="flex items-center space-x-2 pt-2 pl-1">
					{readOnlyIsAgreed ? (
						<Check className="h-5 w-5 text-green-600" />
					) : (
						<X className="h-5 w-5 text-red-600" />
					)}
					<Label className="font-normal">
						{agreeOption?.description?.en ?? 'Agreement Status'}
						{readOnlyIsAgreed === null || readOnlyIsAgreed === undefined
							? ': Not Answered'
							: readOnlyIsAgreed
								? ': Agreed'
								: ': Not Agreed'}
					</Label>
				</div>
			) : (
				// Editable display
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
										disabled={isReadOnly} // Disable
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<Label htmlFor={fieldName} className="font-normal">
										{agreeOption?.description?.en ?? 'I Agree'}
									</Label>
								</div>
							</FormItem>
							<FormMessage id={`${fieldName}-message`}>{error?.message}</FormMessage>
						</>
					)}
				/>
			)}

			{/* Render Additional Answers if the agree option has them */}
			{agreeOption?.additionalAnswers && (
				<AdditionalAnswersSection
					controlNamePrefix={`questions.${questionIndex}.options.0.additionalAnswers`}
					additionalAnswersData={agreeOption.additionalAnswers}
					allowMultiple={agreeOption.multipleAdditionalAnswers}
					parentOptionId={agreeOption.id}
					isReadOnly={isReadOnly}
					initialGroups={isReadOnly ? agreeOption.additionalAnswers.answers : undefined}
				/>
			)}
		</FormItem>
	);
}
