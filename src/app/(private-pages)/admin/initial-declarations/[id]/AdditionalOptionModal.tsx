'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	createAdditionalOption,
	CreateAdditionalOptionRequest
} from '@/api-client/admin/initial-declarations/options/createAdditionalOption';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
	optionId: number;
	onAdd?: () => Promise<void>;
}

export function AdditionalOptionModal({ optionId, onAdd }: Props) {
	const [open, setOpen] = useState(false);
	const form = useForm<CreateAdditionalOptionRequest>({
		defaultValues: {
			optionId,
			description: { en: '', ru: '', kz: '' },
			isRequired: false
		}
	});

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			await createAdditionalOption(values);
			setOpen(false);
			form.reset({
				optionId,
				description: { en: '', ru: '', kz: '' },
				isRequired: false
			});
			if (onAdd) {
				await onAdd();
			}
		} catch (err) {
			console.error(err);
		}
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="flex items-center bg-amber-500">
					<Plus className="mr-2 h-4 w-4" />
					<span>Add Additional Option</span>
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Additional Option</DialogTitle>
					<DialogDescription>Provide localized descriptions for the additional option.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-4">
						{(['en', 'ru', 'kz'] as const).map((lng) => (
							<FormField
								key={lng}
								control={form.control}
								name={`description.${lng}` as const}
								rules={{ required: `Description (${lng.toUpperCase()}) is required` }}
								render={({ field }) => (
									<FormItem>
										<Label htmlFor={`desc-${lng}`}>Description ({lng.toUpperCase()})</Label>
										<FormControl>
											<Input
												id={`desc-${lng}`}
												placeholder={`Enter description in ${lng}`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						<FormField
							control={form.control}
							name="isRequired"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<Label>Required</Label>
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
