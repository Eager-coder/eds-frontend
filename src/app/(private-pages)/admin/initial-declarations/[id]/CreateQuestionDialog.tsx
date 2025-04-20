'use client';

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import {
	createInitialDeclarationQuestion,
	CreateInitialDeclarationQuestionRequest,
	QuestionType
} from '@/api-client/admin/initial-declarations/questions/createQuestion';
import { useRouter, useParams } from 'next/navigation';
import { getInitialDeclarationById } from '@/api-client/admin/initial-declarations/getInitialDeclarationById';

interface Props {
	orderNumber: number;
	onAdded?: () => Promise<void>;
}

export function CreateQuestionDialog({ orderNumber, onAdded }: Props) {
	const [openModal, setOpenModal] = useState(false);
	const params = useParams();
	const declarationId = Number(params.id);
	const [showNote, setShowNote] = useState(false);

	const form = useForm<CreateInitialDeclarationQuestionRequest>({
		defaultValues: {
			orderNumber,
			declarationId,
			description: { en: '', ru: '', kz: '' },
			questionType: QuestionType.OPEN_ENDED,
			note: { en: '', ru: '', kz: '' },
			isRequired: false
		},
		values: {
			orderNumber,
			declarationId,
			description: { en: '', ru: '', kz: '' },
			questionType: QuestionType.OPEN_ENDED,
			note: { en: '', ru: '', kz: '' },
			isRequired: false
		}
	});

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			// if no note content, remove note property
			const payload = {
				...values,
				note: showNote ? values.note : undefined
			};
			await createInitialDeclarationQuestion(payload as CreateInitialDeclarationQuestionRequest);
			form.reset({
				orderNumber,
				declarationId,
				description: { en: '', ru: '', kz: '' },
				questionType: QuestionType.OPEN_ENDED,
				note: { en: '', ru: '', kz: '' },
				isRequired: false
			});
			setShowNote(false);
			// refetch or refresh page
			// await getInitialDeclarationById(declarationId);
			if (onAdded) {
				await onAdded();
			}
			setOpenModal(false);
		} catch (err) {
			console.error(err);
		}
	});

	return (
		<Dialog open={openModal} onOpenChange={setOpenModal}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Plus className="mr-2 h-4 w-4" /> New Question
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create Question</DialogTitle>
					<DialogDescription>Fill out the form to add a new question.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-4">
						{/* Order Number */}
						<FormField
							control={form.control}
							name="orderNumber"
							rules={{ required: 'Order is required' }}
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="orderNumber">Order Number</Label>
									<FormControl>
										<Input type="number" id="orderNumber" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description (en, ru, kz) */}
						{(['en', 'ru', 'kz'] as const).map((lng) => (
							<FormField
								key={lng}
								control={form.control}
								name={`description.${lng}` as const}
								rules={{ required: `${lng.toUpperCase()} description is required` }}
								render={({ field }) => (
									<FormItem>
										<Label htmlFor={`description-${lng}`}>Question ({lng.toUpperCase()})</Label>
										<FormControl>
											<Input
												id={`description-${lng}`}
												placeholder={`Enter question in ${lng}`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						{/* Question Type */}
						<FormField
							control={form.control}
							name="questionType"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="questionType">Select question type</Label>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="questionType">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(QuestionType).map((type) => (
													<SelectItem key={type} value={type}>
														{type.replace(/_/g, ' ').toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Note toggle */}
						<div className="flex items-center">
							<Checkbox
								id="toggle-note"
								checked={showNote}
								onCheckedChange={(checked) => setShowNote(!!checked)}
							/>
							<Label htmlFor="toggle-note" className="ml-2">
								Add Note?
							</Label>
						</div>

						{/* Note fields if shown */}
						{showNote &&
							(['en', 'ru', 'kz'] as const).map((lng) => (
								<FormField
									key={lng}
									control={form.control}
									name={`note.${lng}` as const}
									rules={{
										required: showNote ? `${lng.toUpperCase()} note is required` : false
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Note ({lng.toUpperCase()})</FormLabel>
											<FormControl>
												<Input
													id={`note-${lng}`}
													placeholder={`Enter note in ${lng}`}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

						{/* Is Required */}
						<FormField
							control={form.control}
							name="isRequired"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>Required</FormLabel>
								</FormItem>
							)}
						/>

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
