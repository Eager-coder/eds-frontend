'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	createQuestionOption,
	CreateQuestionOptionRequest
} from '@/api-client/admin/initial-declarations/options/createQuestionOption';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { QuestionType } from '@/api-client/admin/initial-declarations/questions/createQuestion';

interface Props {
	questionId: number;
	onAdded?: () => void;
	questionType: QuestionType;
}

export default function AddOptionDialog({ questionId, onAdded, questionType }: Props) {
	const [showAdditional, setShowAdditional] = useState(false);
	const form = useForm<CreateQuestionOptionRequest>({
		defaultValues: {
			questionId,
			description: { en: '', ru: '', kz: '' },
			additionalAnswerDescription: { en: '', ru: '', kz: '' },
			multipleAdditionalAnswers: false,
			isConflict: false
		}
	});

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			const payload: CreateQuestionOptionRequest = {
				questionId: values.questionId,
				description: values.description,
				additionalAnswerDescription: showAdditional ? values.additionalAnswerDescription! : null,
				multipleAdditionalAnswers: showAdditional ? values.multipleAdditionalAnswers : false,
				isConflict: values.isConflict
			};
			const newOpt = await createQuestionOption(payload);
			if (onAdded) {
				onAdded();
			}
			form.reset({
				questionId,
				description: { en: '', ru: '', kz: '' },
				additionalAnswerDescription: { en: '', ru: '', kz: '' },
				multipleAdditionalAnswers: false,
				isConflict: false
			});
			setShowAdditional(false);
		} catch (e) {
			console.error(e);
		}
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="cursor-pointer">
					<Plus /> <span>Add option</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Question Option</DialogTitle>
					<DialogDescription>Fill in the fields to add a new option to this question.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-4">
						{/* Description fields (en, ru, kz) */}
						{(['en', 'ru', 'kz'] as const).map((lng) => (
							<FormField
								key={lng}
								control={form.control}
								name={`description.${lng}` as const}
								rules={{ required: `Description (${lng}) is required` }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description ({lng.toUpperCase()})</FormLabel>
										<FormControl>
											<Input placeholder={`Enter description in ${lng}`} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						{/* Toggle additional answer description */}
						{questionType !== QuestionType.AGREE && (
							<div className="flex items-center space-x-2">
								<Checkbox
									id="toggle-additional-answer-description"
									checked={showAdditional}
									onCheckedChange={(checked) => setShowAdditional(!!checked)}
								/>
								<Label htmlFor="toggle-additional-answer-description">Add Additional Answer?</Label>
							</div>
						)}

						{/* Additional answer fields if toggled */}
						{showAdditional &&
							questionType !== QuestionType.AGREE &&
							(['en', 'ru', 'kz'] as const).map((lng) => (
								<FormField
									key={lng}
									control={form.control}
									name={`additionalAnswerDescription.${lng}` as const}
									rules={{ required: `Additional answer (${lng}) is required` }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Additional Answer Description({lng.toUpperCase()})</FormLabel>
											<FormControl>
												<Input placeholder={`Enter additional answer in ${lng}`} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

						{/* Multiple Additional Answers */}
						{questionType !== QuestionType.AGREE && showAdditional && (
							<FormField
								control={form.control}
								name="multipleAdditionalAnswers"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={!showAdditional}
											/>
										</FormControl>
										<FormLabel>Allow multiple additional answers?</FormLabel>
									</FormItem>
								)}
							/>
						)}

						{/* Conflict Option */}
						{questionType !== QuestionType.AGREE && (
							<FormField
								control={form.control}
								name="isConflict"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Is conflict option?</FormLabel>
									</FormItem>
								)}
							/>
						)}

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
